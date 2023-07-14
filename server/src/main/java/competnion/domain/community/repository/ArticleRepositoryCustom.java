package competnion.domain.community.repository;

import competnion.domain.community.dto.ArticleQueryDto;
import org.locationtech.jts.geom.Point;

import java.util.List;

public interface ArticleRepositoryCustom {
    List<ArticleQueryDto> findAllByKeywordAndDistance(
            Point userPoint,
            String keyword,
            int days,
            Double distance,
            long offset,
            int limit);
}
