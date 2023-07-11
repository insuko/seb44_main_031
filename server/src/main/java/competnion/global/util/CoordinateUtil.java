package competnion.global.util;


import competnion.global.exception.BusinessLogicException;
import competnion.global.exception.ExceptionCode;
import org.locationtech.jts.geom.Point;
import org.locationtech.jts.io.ParseException;
import org.locationtech.jts.io.WKTReader;
import org.springframework.stereotype.Component;



@Component
public class CoordinateUtil {
    public Point coordinateToPoint(
            final Double latitude,
            final Double longitude
    ) {
        if (latitude != null && longitude != null) {
            try {
                return (Point) new WKTReader().read(String.format("POINT(%s %s)", latitude, longitude));
            } catch (ParseException e) {
                throw new BusinessLogicException(ExceptionCode.INVALID_INPUT_VALUE);
            }
        } else {
            throw new BusinessLogicException(ExceptionCode.INVALID_INPUT_VALUE);
        }
    }
}
