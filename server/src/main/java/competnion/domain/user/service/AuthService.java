package competnion.domain.user.service;

import competnion.domain.user.dto.request.ResetPasswordRequest;
import competnion.domain.user.dto.request.SignUpRequest;
import org.locationtech.jts.geom.Point;
import org.locationtech.jts.io.ParseException;

import javax.mail.MessagingException;

public interface AuthService {
    void signUp(SignUpRequest signUpRequest);
    void checkDuplicateAndSendVerificationEmail(String email);
    void verifyEmailCode(String code, String email);
//    Boolean isDuplicateEmail(String email);
    void checkDuplicateUsername(String username);
    void resetPassword(ResetPasswordRequest resetPasswordRequest);
}
