import { styled } from 'styled-components';
import { FaRegClock, FaMapMarkerAlt } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import { API_URL, AUTH_TOKEN } from '../../api/APIurl';
import { useParams } from 'react-router-dom';
import axios from 'axios';

declare global {
  interface Window {
    kakao: any;
  }
}

interface ArticleData {
  startDate: string;
  location: number;

}

const WalkMateDetailSide = () => {
  const [map, setMap] = useState<any>();
  const [marker, setMarker] = useState<any>();
  console.log(map, marker);
  const { articleId } = useParams<{ articleId: string }>();
  const [articleData, setArticleData] = useState<ArticleData | null>(null);

  useEffect(() => {
    window.kakao.maps.load(() => {
      const container = document.getElementById('map');
      const options = {
        center: new window.kakao.maps.LatLng(33.450701, 126.570667),
        level: 3,
      };

      setMap(new window.kakao.maps.Map(container, options));
      setMarker(new window.kakao.maps.Marker());
    });
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL}/articles/${articleId}`, {
          headers: {
            Authorization: AUTH_TOKEN,
          },
        });

        setArticleData(response.data.article);
      } catch (error) {
        console.error('attendees 가져오는중 오류 발생:', error);
      }
    };

    fetchData();
  }, [articleId]);

  const formatDateTime = (isoString: string) => {
    const date = new Date(isoString);
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    };
  
    const formattedDate = new Intl.DateTimeFormat('en-US', options).format(date);
  
    return `${formattedDate}`;
  };

  return (
    <SlideBox>
      <SlideContainer>
        <SideTextDown>
          <div className="Line">
            <FaRegClock className="Icon" />
            {articleData && formatDateTime(articleData.startDate)}
          </div>
          <div className="Line">
            <div className="Name">
              <FaMapMarkerAlt className="LocationIcon" />
              {articleData && (articleData.location)}
            </div>
          </div>
        </SideTextDown>
      </SlideContainer>
      <MapContainer id="map" />
    </SlideBox>
  );
};

export default WalkMateDetailSide;

const SlideContainer = styled.div`
  margin-top: 40px;
  width: 280px;
  height: 150px;
  border-radius: 30px;
  background-color: #fcfcfc;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); 
`;

const SideTextDown = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  .Line {
    display: flex;
    align-items: center;
  }

  .Icon {
    margin-top: -5px;
    margin-right: 5px;
    font-size: 17px;
    color: var(--black-900);
  }

  .Name {
    margin-top: 20px;
    font-size: 16px;
    font-weight: bold;
    color: var(--black-900);
  }
`;

const MapContainer = styled.div`
  margin-top: 50px;
  border-radius: 30px;
  width: 280px;
  height: 500px;
`;

const SlideBox = styled.div`
  margin-left: 50px;
`;