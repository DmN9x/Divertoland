package com.websocket.divertoland.services;

import com.websocket.divertoland.domain.Brinquedo;
import com.websocket.divertoland.domain.Fila;
import com.websocket.divertoland.domain.dto.LoginDTO;
import com.websocket.divertoland.repository.UserRepository;
import com.websocket.divertoland.domain.Usuario;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    public UserRepository userRepository;

    public void createVisitorAccount(Usuario usuario) {
        userRepository.save(usuario);
//        String sql = "insert into user (name,email,password,role) values (?,?,?,?)";
//        try (Connection conn = DatabaseUtil.getConnection();
//             PreparedStatement stmt = conn.prepareStatement(sql)) {
//            stmt.setString(1, user.getName());
//            stmt.setString(2, user.getEmail());
//            stmt.setString(3, user.getPassword());
//            stmt.setString(4, Role.VISITOR.name());
//            stmt.executeUpdate();
//            System.out.println("Usuário criado com sucesso!");
//        } catch (SQLException e) {
//            e.printStackTrace();
//        }
    }

    public Usuario login(LoginDTO loginDTO) {

//        String sql = "Select * from user where email = ? and password = ?";
//        User user = null;
//        try (Connection conn = DatabaseUtil.getConnection();
//             PreparedStatement stmt = conn.prepareStatement(sql)) {
//            stmt.setString(1, email);
//            stmt.setString(2, password);
//
//            try (ResultSet rs = stmt.executeQuery()) {
//                if (rs.proximo()) {
//                    Long id = rs.getLong("id");
//                    String name = rs.getString("name");
//                    String email = rs.getString("email");
//                    String role = rs.getString("role");
//
//                    user = new User(id, name, email, Role.valueOf(role));
//                }
//            }
//        } catch (SQLException e) {
//            e.printStackTrace();
//        }
        return  userRepository.findByEmailAndSenha(loginDTO.getEmail(),loginDTO.getSenha()).orElseThrow();
    }

    public void entrarFila(Usuario usuario, Brinquedo brinquedo){



    }


}
