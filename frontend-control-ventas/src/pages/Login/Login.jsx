import React, { useState } from "react";
import { Formik, Form } from "formik";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../../services/axios.config";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Modal,
} from "@mui/material";

const Login = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const navigate = useNavigate();

  const validateFields = (values) => {
    if (!values.txtUsr) {
      setModalMessage("El Usuario es obligatorio");
      setModalVisible(true);
      return false;
    }
    if (!values.txtPass) {
      setModalMessage("La Clave es obligatoria");
      setModalVisible(true);
      return false;
    }
    return true;
  };

  const handleLogin = async (values, setSubmitting) => {
    try {
      const response = await axiosInstance.post("/login", {
        txtUsr: values.txtUsr,
        txtPass: values.txtPass,
      });

      if (response.status === 200) {
        sessionStorage.setItem("token", response.data.access_token);
        sessionStorage.setItem("id_usuario", response.data.id_usuario);
        navigate("/inicio");
      } else {
        setModalMessage("Usuario o Contraseña Incorrectos.");
        setModalVisible(true);
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      if (error.response) {
        setModalMessage(error.response.data.msg || "Credenciales inválidas");
      } else if (error.request) {
        setModalMessage("No se pudo conectar con el servidor.");
      } else {
        setModalMessage("Ocurrió un error inesperado.");
      }
      setModalVisible(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        width: "100vw",
        backgroundColor: "#fafafa",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Container
        maxWidth="xs"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          padding: 2,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            width: "100%",
            maxWidth: "400px",
            boxSizing: "border-box",
          }}
        >
          <Typography
            variant="h4"
            align="center"
            gutterBottom
            sx={{
              fontSize: { xs: "1.5rem", sm: "2rem" },
            }}
          >
            Acceso Administrativo
          </Typography>
          <Typography
            variant="body1"
            align="center"
            gutterBottom
            sx={{
              fontSize: { xs: "0.9rem", sm: "1rem" },
            }}
          >
            Ingrese Usuario y Contraseña
          </Typography>
          <Formik
            initialValues={{ txtUsr: "", txtPass: "" }}
            onSubmit={(values, { setSubmitting }) => {
              if (validateFields(values)) {
                handleLogin(values, setSubmitting);
              } else {
                setSubmitting(false);
              }
            }}
          >
            {({ isSubmitting, handleChange, values }) => (
              <Form>
                <Box sx={{ mb: 2 }}>
                  <TextField
                    fullWidth
                    label="Usuario"
                    name="txtUsr"
                    value={values.txtUsr}
                    onChange={handleChange}
                    variant="outlined"
                    sx={{
                      "& .MuiInputLabel-root": {
                        color: "gray",
                      },
                      "& .MuiInputLabel-root.Mui-focused": {
                        color: "green",
                      },
                      "& .MuiOutlinedInput-root": {
                        "&.Mui-focused fieldset": {
                          borderColor: "green",
                        },
                      },
                    }}
                  />
                </Box>
                <Box sx={{ mb: 2 }}>
                  <TextField
                    fullWidth
                    label="Clave"
                    name="txtPass"
                    type="password"
                    value={values.txtPass}
                    onChange={handleChange}
                    variant="outlined"
                    sx={{
                      "& .MuiInputLabel-root": {
                        color: "gray",
                      },
                      "& .MuiInputLabel-root.Mui-focused": {
                        color: "green",
                      },
                      "& .MuiOutlinedInput-root": {
                        "&.Mui-focused fieldset": {
                          borderColor: "green",
                        },
                      },
                    }}
                  />
                </Box>
                <Button
                  type="submit"
                  variant="contained"
                  color="success"
                  fullWidth
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Iniciando..." : "INGRESAR"}
                </Button>
              </Form>
            )}
          </Formik>
        </Paper>

        <Modal
          open={modalVisible}
          onClose={() => setModalVisible(false)}
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
              borderRadius: 2,
              textAlign: "center",
            }}
          >
            <Typography id="modal-title" variant="h6" component="h2">
              Error de Inicio de Sesión
            </Typography>
            <Typography id="modal-description" sx={{ mt: 2 }}>
              {modalMessage}
            </Typography>
            <Button
              variant="contained"
              color="success"
              onClick={() => setModalVisible(false)}
              sx={{ mt: 2 }}
            >
              Cerrar
            </Button>
          </Box>
        </Modal>
      </Container>
    </Box>
  );
};

export default Login;
