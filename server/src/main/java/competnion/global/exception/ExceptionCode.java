package competnion.global.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum ExceptionCode {

    INVALID_INPUT_VALUE(400,"Invalid Input Value"),
    INVALID_IMAGE_EXTENSION(400, "INVALID IMAGE EXTENSION"),
    INVALID_COORDINATES(400, "INVALID COORDINATES"),
    INVALID_EMAIL(400, "INVALID EMAIL"),
    INVALID_EMAIL_CODE(400, "INVALID EMAIL CODE"),

    ACCESS_NOT_ALLOWED(401, "YOU ARE NOT OWNER OF THIS CONTENT"),
    ACCESS_TOKEN_EXPIRED(401,"ACCESS TOKEN EXPIRED"),
    ACCESS_TOKEN_NULL(401,"ACCESS TOKEN NOT FOUND IN HEADER"),
    ACCESS_TOKEN_REGISTERED_LOGOUT(401,"ACCESS TOKEN REGISTERED LOGOUT"),
    REFRESH_TOKEN_TAMPERED(401, "REFRESH TOKEN NOT FOUND IN DB"),
    REFRESH_TOKEN_NULL(401, "REFRESH TOKEN NOT FOUND IN HEADER"),

    FORBIDDEN(404, "FORBIDDEN FOR REGISTER MORE DOG"),
    USER_NOT_FOUND(404, "USER NOT FOUND"),
    PET_NOT_FOUND(404, "PET NOT FOUND"),
    BREED_NOT_FOUND(404, "BREED NOT FOUND"),
    ARTICLE_NOT_FOUND(404, "ARTICLE NOT FOUND"),
    COMMENT_NOT_FOUND(404, "COMMENT NOT FOUND"),

    PET_NOT_MATCH(409, "PET NOT MATCH"),
    PASSWORD_NOT_MATCH(409, "PASSWORD NOT MATCH"),
    NEW_PASSWORD_NOT_MATCH(409, "NEW PASSWORD NOT MATCH"),
    MEETING_TIME_CLOSED(409, "MEETING TIME CLOSED"),
    NOT_VALID_START_DATE(409, "NOT VALID START TIME"),
    NOT_VALID_MEETING_DATE(409, "NOT VALID MEETING TIME"),
    NO_SPACE_FOR_ATTEND(409, "NO SPACE FOR ATTEND"),
    DUPLICATE_EMAIL(409, "DUPLICATE EMAIL"),
    DUPLICATE_USERNAME(409, "DUPLICATE USERNAME"),
    CAN_NOT_ATTEND_IN_OWN_ARTICLE(409, "CAN_NOT_ATTEND_IN_OWN_ARTICLE"),
    PET_ALREADY_ATTENDED(409, "PET_ALREADY_ATTENDED"),
    USER_ALREADY_ATTENDED(409, "USER ALREADY ATTENDED"),
    CAN_NOT_CLOSE(409, "CAN NOT CLOSE"),

    S3_IMAGE_UPLOAD_FAILED(500, "S3 IMAGE UPLOAD FAILED"),
    PARSE_TO_COORDINATES_FAILED(500, "PARSE TO COORDINATES FAILED"),
    SEND_EMAIL_FAILED(500, "SEND EMAIL FAILED")
    ;

    @Getter
    private final int status;
    @Getter
    private final String message;

    ExceptionCode(int status, String message) {
        this.status = status;
        this.message = message;
    }
}
