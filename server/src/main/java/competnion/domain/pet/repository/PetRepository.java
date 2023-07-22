package competnion.domain.pet.repository;

import competnion.domain.pet.entity.Pet;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PetRepository extends JpaRepository<Pet, Long>, PetRepositoryCustom {

//    List<Pet> findAllById(List<Long> petIds);
    Integer countByUserId(Long userId);
    List<Pet> findAllByArticleId(Long articleId);
    List<Pet> findAllByArticleIdAndUserId(Long articleId, Long userId);
}