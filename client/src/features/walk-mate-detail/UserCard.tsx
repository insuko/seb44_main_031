import { useState, useEffect } from 'react';
import axios from 'axios';
import { styled } from 'styled-components';
import { useNavigate, useParams } from 'react-router-dom';
import { API_URL,  TOKEN_USERID } from '../../api/APIurl';
import { FiTrash2 } from 'react-icons/fi';
import { toast } from 'react-toastify';

interface Attendee {
  id: number;
  nickname: string;
  imgUrl: string | null;
  pets: Pet[];
  userId: number;
}

interface Pet {
  name: string;
  gender: boolean;
}

interface AttendeeInfo {
  name: string;
  imgUrl: string;
  id: number;
}

interface PetItemProps {
  readonly $isSelected: boolean;
}
interface ArticleData {
  startDate: string;
  endDate: string;
  attendant: number;
}
interface AttendeeInfoResponse {
  result: AttendeeInfo[];
}


const UserCard = () => {
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedPets, setSelectedPets] = useState<number[]>([]);
  const [attendeeInfo, setAttendeeInfo] = useState<AttendeeInfo[]>([]);
  const { articleId } = useParams<{ articleId: string }>();
  const [articleData, setArticleData] = useState<ArticleData | null>(null);
  const [isAttendeeInfoFetched, setIsAttendeeInfoFetched] = useState(false);
  const [isUserAttending, setIsUserAttending] = useState(false);
  const navigate = useNavigate();

  
  //산책 상세페이지 get 요청
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL}/articles/${articleId}`, {
          headers: {
            Authorization: localStorage.getItem('accessToken'),
          },
        });

        setAttendees(response.data.attendees);
        setArticleData(response.data.article);

  
        const userIsAttending = response.data.attendees.some(
          (attendee: Attendee) => attendee.userId === parseInt(TOKEN_USERID)
        );
        setIsUserAttending(userIsAttending);
      } catch (error) {
        toast.error('attendees 가져오는중 오류 발생:', error);
      }
    };

    fetchData();
  }, []);
  // 참가하기 버튼 눌렀을때
  const fetchAttendeeInfo = async () => {
    try {
      const response = await axios.get<AttendeeInfoResponse>(
        `${API_URL}/articles/attendee-info/${articleId}`,
        {
          headers: {
            Authorization: localStorage.getItem('accessToken'),
          },
        }
      );
      setAttendeeInfo(response.data.result);
    } catch (error: any) {
      if (error.response && error.response.status === 409) {
        toast.error('이미 참가한 유저입니다.');
      } else {
        toast.error('api 가져오는 중 오류 발생:', error);
      }
    }
  };

  const openModal = async () => {
    if (!isAttendeeInfoFetched) {
      await fetchAttendeeInfo();
      setIsAttendeeInfoFetched(true);
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handlePetSelect = (petId: number) => {
    if (selectedPets.includes(petId)) {
      setSelectedPets(selectedPets.filter((pet) => pet !== petId));
    } else {
      setSelectedPets([...selectedPets, petId]);
    }
  };





// 강아지 데리고 갈 목록들 post
const handleRegister = async () => {
  if (!articleData) {
    return;
  }

  const { startDate, endDate, attendant } = articleData;
  const selectedPetIds = selectedPets.map((petId) => petId);


  const formattedStartDate = startDate ? startDate.substring(0, 16) : null;
  const formattedEndDate = endDate ? endDate.substring(0, 16) : null;

  const postData = {
    petIds: selectedPetIds,
    articleId: articleId ? parseInt(articleId) : undefined,
    startDate: formattedStartDate,
    endDate: formattedEndDate,
    attendant,
  };


  try {
    
    await axios.post(`${API_URL}/articles/attend`, postData, {
      headers: {
        Authorization: localStorage.getItem('accessToken'),
      },
    }); 
   
    window.location.reload();
    closeModal();
  } catch (error : any) {
    if (error.response && error.response.status === 409) {
      const errorMessage = error.response.data.message;
        if (errorMessage === 'MEETING TIME CLOSED') {
      toast.error('이미 마감된 산책모임입니다❗');
    } if (errorMessage === 'NOT_VALID_MEETING_DATE') {
      toast.error('이미 겹치는 시간에 참여 하였습니다.❗');
    }  if (errorMessage === 'PET_ALREADY_ATTENDED') {
      toast.error('선택된 강아지는 이미 참여중입니다.❗');
    } 
    else {
      console.log(formattedStartDate)
    }
  }
  }
};

  const getPetImageUrl = (gender: boolean) => {
    if (gender) {
      return '/assets/petmily-logo-pink.png';
    } else {
      return '/assets/petmily-logo-white.png';
    }
  };

  const handleDeleteUser = async (userId: number) => {
    try {
      await axios.delete(`${API_URL}/articles/cancel/${articleId}`, {
        headers: {
          Authorization: localStorage.getItem('accessToken'),
        },
      });

      setAttendees((prevAttendees) =>
        prevAttendees.filter((attendee) => attendee.id !== userId)
      );
      window.location.reload();
    } catch (error) {
      console.error('삭제 중 오류 발생:', error);
    }
  };


  const handleDeleteArticle = async (userId: number) => {
    try {
 
      const ownerUserId = attendees[0].userId;
      if (ownerUserId !== parseInt(TOKEN_USERID)) {
        toast.error('작성자만 삭제가 가능합니다.');
        console.log('글의 주인이 아니므로 삭제할 수 없습니다.');
        return;
      }
  
      await axios.delete(`${API_URL}/articles/${articleId}`, {
        headers: {
          Authorization: localStorage.getItem('accessToken'),
        },
      });
  
      setAttendees((prevAttendees) =>
        prevAttendees.filter((attendee) => attendee.id !== userId)
      );
      navigate('/walk-mate/all')
      toast.success('게시글 삭제가 완료되었습니다.')
    } catch (error:any) {
      console.error('삭제 중 오류 발생:', error);
  
      if (error.response && error.response.status === 409) {
        const errorMessage = error.response.data.message;
        if (errorMessage === 'USER ALREADY ATTENDED') {
          toast.error('유저가 참가되어 있어서 삭제 불가합니다.');
        } else {
          toast.error('삭제 중 오류가 발생했습니다. 다시 시도해주세요.');
        }
      } else {
        toast.error('삭제 중 오류가 발생했습니다. 다시 시도해주세요.');
      }
    }
  };

  const handleWalkEnd = async () => {
    try {

      await axios.post(`${API_URL}/articles/close/${articleId}`,{} ,{
        headers: {
          Authorization: localStorage.getItem('accessToken'),
        },
      });
      navigate('/walk-mate/all')
      toast.success('산책이 종료되었습니다.')
      console.log('산책이 종료되었습니다.');
   
    } catch (error:any) {
      
      console.error('산책 종료 중 오류 발생:', error);
      if (error.response && error.response.status === 409) {
        toast.error('산책 종료 시간이 아닙니다.');
      } else {
        toast.error('산책 종료 중 오류가 발생했습니다. 다시 시도해주세요.');
      }
    }
  };

  return (
    <>
      <UserCardContainer>
        <UserCardRow>
          {attendees.map((attendee, index) => (
            <UserCardComponent
              key={index}
              onClick={() => {
                navigate(`/users/userpage/${attendee.userId}`);
              }}
            >
              {index > 0 && (
                <div>
                  {attendee.userId ===
                    (TOKEN_USERID !== null ? parseInt(TOKEN_USERID) : null) && (
                      <FiTrash2
                      className="delete-icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteUser(attendee.id);
                      }}
                    />
                  )}
                </div>
              )}
              <ProfileCard
                src={attendee.imgUrl ?? undefined}
                alt="프로필이미지"
              />
              <Username>{attendee.nickname}</Username>
          <Role>{index === 0 ? 'Host' : 'Member'}</Role>
              <Tooltip>
                {attendee.pets.map((pet, index) => (
                  <PetInfo key={index}>
                    <PetImage
                      src={getPetImageUrl(pet.gender)}
                      alt="강아지 이미지"
                    />
                    <PetName>{pet.name}</PetName>
                  </PetInfo>
                ))}
              </Tooltip>
            </UserCardComponent>
          ))}
        </UserCardRow>
      </UserCardContainer>
      <ButtonBox>
      {!isUserAttending && <button onClick={openModal}>참가하기</button>}
      <button onClick={() => handleDeleteArticle(attendees[attendees.length - 1].userId)}>글 삭제</button>

      
      {attendees.length > 0 && attendees[0].userId === parseInt(TOKEN_USERID) && (
          <button onClick={handleWalkEnd}>산책 종료</button>
        )}
      </ButtonBox>

      {showModal && (
        <ModalContainer>
          <ModalContent>
            <h2>산책에 데려갈 강아지 선택</h2>
            <PetList>
              {attendeeInfo !== null &&
                attendeeInfo.map((pets, index) => (
                  <PetItem
                    key={index}
                    onClick={() => handlePetSelect(pets.id)}
                    $isSelected={selectedPets.includes(pets.id)}
                  >
                    <PetImage src={pets.imgUrl} alt="강아지 이미지" />
                    <PetName>{pets.name}</PetName>
                    {selectedPets.includes(pets.id) && (
                      <PetCheckIcon>&#10003;</PetCheckIcon>
                    )}
                  </PetItem>
                ))}
            </PetList>
            <ButtonBox>
              <button onClick={closeModal}>닫기</button>
              <button
                onClick={handleRegister}
                disabled={selectedPets.length === 0}
              >
                등록하기
              </button>
            </ButtonBox>
          </ModalContent>
          <ModalOverlay onClick={closeModal} />
        </ModalContainer>
      )}
    </>
  );
};

export default UserCard;

const UserCardContainer = styled.div`
  width: 600px;
  height: 250px;
  border-radius: 30px;
  background-color: var(--pink-100);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
`;

const UserCardRow = styled.div`
  display: flex;
  margin-left: 10px;
`;

const UserCardComponent = styled.div`
  position: relative;
  display: inline-block;
  width: 130px;
  height: 180px;
  background-color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  border-radius: 10px;
  margin-right: 10px;
  box-shadow: 0px 8px 10px rgba(0, 0, 0, 0.2), 0px 3px 6px rgba(0, 0, 0, 0.15);
  transform: translateY(0);
  transition: transform 0.3s ease-in-out;
  cursor: pointer;

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0px 12px 15px rgba(0, 0, 0, 0.3),
      0px 5px 10px rgba(0, 0, 0, 0.2);
  }
  .delete-icon {
    position: absolute;
    top: 5px;
    right: 5px;
    cursor: pointer;
    width: 15px;
    height: 15px;
    fill: var(--pink-200);
  }
`;

const Tooltip = styled.div`
  position: absolute;
  width: 120px;
  left: 50%;
  bottom: 190px;
  transform: translateX(-50%);
  background-color: var(--pink-300);
  padding: 10px;
  border-radius: 5px;
  color: #fff;
  text-align: center;
  display: none;

  &::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border-width: 8px;
    border-style: solid;
    border-color: transparent transparent var(--pink-300) transparent;
  }

  ${UserCardComponent}:hover & {
    display: block;
  }
`;

const ProfileCard = styled.img`
  width: 80px;
  margin-bottom: 10px;
`;

const Username = styled.div`
  margin-top: 10px;
  font-size: 18px;
  font-weight: bold;
`;

const Role = styled.div`
  margin-top: 5px;
  font-size: 14px;
  color: gray;
`;

const PetInfo = styled.div`
  display: flex;
  align-items: center;
  margin-top: 5px;
`;

const PetImage = styled.img`
  width: 25px;
  height: 25px;
  border-radius: 50%;
  margin-bottom: 10px;
`;

const PetName = styled.div`
  font-size: 15px;
  margin-left: 10px;
  text-align: center;
`;

const ButtonBox = styled.div`
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;

  button {
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    background-color: var(--pink-400);
    color: white;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
  }
`;

const ModalContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 40px;
  border-radius: 10px;
  z-index: 10;
  max-width: 500px;
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 5;
`;

const PetList = styled.div`
  margin-top: 10px;
  gap: 10px;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
`;

const PetItem = styled.div<PetItemProps>`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  cursor: pointer;
  width: 120px;
  height: 50px;
  padding: 8px;
  border-radius: 5px;
  transition: background-color 0.3s;
  background-color: ${(props) =>
    props.$isSelected ? 'var(--pink-300)' : 'transparent'};
  color: ${(props) => (props.$isSelected ? 'white' : 'inherit')};

  &:hover {
    background-color: var(--pink-300);
  }
`;

const PetCheckIcon = styled.span`
  margin-left: 1px;
`;