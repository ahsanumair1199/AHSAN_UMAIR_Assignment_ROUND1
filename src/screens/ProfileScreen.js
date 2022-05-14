import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Pie, Doughnut } from "react-chartjs-2";
import {
  Container,
  Navbar,
  Row,
  Col,
  ListGroup,
  Form,
  Button,
  Table,
} from "react-bootstrap";
import { logout } from "../actions/userAction";
import axios from "axios";
import { Chart, ArcElement } from "chart.js";
Chart.register(ArcElement);
const ProfileScreen = () => {
  const state = {
    labels: ["UnitsSold", "UnitPrice", "UnitCost"],
    datasets: [
      {
        label: "SalesData",
        backgroundColor: [
          "#B21F00",
          "#C9DE00",
          "#2FDE00",
          "#00A6B4",
          "#6800B4",
        ],
        hoverBackgroundColor: [
          "#501800",
          "#4B5000",
          "#175000",
          "#003350",
          "#35014F",
        ],
        data: [40, 30, 20],
      },
    ],
  };
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  const [data1, setData] = useState([]);
  //const dataObj = Object.assign({}, data);
  const [file, setFile] = useState();
  const [show, setShow] = useState(false);
  const dispatch = useDispatch();
  const history = useNavigate();
  const handleLogout = () => {
    dispatch(logout());
  };
  useEffect(() => {
    if (userInfo === null) {
      history("/");
    }
  }, [history, userInfo]);

  const handleFile = (e) => {
    e.preventDefault();
    const fileToUpload = e.target.files[0];
    setFile(fileToUpload);
  };
  const handleSubmitData = (e) => {
    e.preventDefault();
    let formData = new FormData();
    formData.append("file", file);
    axios
      .post("/api/v1/csvfile/", formData)
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.log(error.response);
      });
    setShow(true);
  };
  return (
    <Container>
      {userInfo && (
        <div className="content">
          <Navbar>
            <Navbar.Brand>
              <Link to="/" className="btn btn-primary" onClick={handleLogout}>
                Logout
              </Link>
            </Navbar.Brand>
            <Navbar.Toggle />
            <Navbar.Collapse className="justify-content-end">
              <Navbar.Text>
                Signed in as:
                <h5>{userInfo.first_name + " " + userInfo.last_name}</h5>
              </Navbar.Text>
            </Navbar.Collapse>
          </Navbar>
          <Row>
            <Col sm="12" md="6" lg="4" xl="4">
              <h1>User Details</h1>
              <ListGroup>
                <ListGroup.Item>
                  <Row>
                    <Col>Your Email:</Col>
                    <Col>{userInfo.email}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Phone Number:</Col>
                    <Col>{userInfo.phone_number}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Address:</Col>
                    <Col>{userInfo.address}</Col>
                  </Row>
                </ListGroup.Item>
              </ListGroup>
              {show && (
                <Pie
                  data={state}
                  options={{
                    title: {
                      display: true,
                      text: "Your Sales Data Report",
                      fontSize: 20,
                    },
                    legend: {
                      display: true,
                      position: "right",
                    },
                  }}
                />
              )}
            </Col>
            <Col sm="12" md="6" lg="8" xl="8">
              <Form onSubmit={handleSubmitData}>
                <Form.Group className="mb-3">
                  <Form.Label>Uplaod CSV file</Form.Label>
                  <Form.Control
                    type="file"
                    name="document"
                    encType="multipart/form-data"
                    accept=".csv"
                    onChange={handleFile}
                  />
                </Form.Group>
                <Button type="submit" className="btn-success">
                  Upload
                </Button>
              </Form>
            </Col>
          </Row>
          <Row className="my-3">
            <Col>
              <h1 className="text-center">Your CSV Data</h1>
              {data1 &&
                data1.map((row) => {
                  const row_list = row.split(",");
                  return (
                    <React.Fragment>
                      <Row
                        className=""
                        style={{
                          border: "1px solid grey",
                          borderRight: "1px solid grey",
                        }}
                      >
                        <Col md="2" style={{ borderRight: "1px solid grey" }}>
                          <p>{row_list[0]}</p>
                        </Col>
                        <Col md="2" style={{ borderRight: "1px solid grey" }}>
                          <p>{row_list[1]}</p>
                        </Col>
                        <Col md="2" style={{ borderRight: "1px solid grey" }}>
                          <p>{row_list[2]}</p>
                        </Col>
                        <Col md="2" style={{ borderRight: "1px solid grey" }}>
                          <p>{row_list[8]}</p>
                        </Col>
                        <Col md="2" style={{ borderRight: "1px solid grey" }}>
                          <p>{row_list[9]}</p>
                        </Col>
                        <Col md="2">
                          <p>{row_list[10]}</p>
                        </Col>
                      </Row>
                    </React.Fragment>
                  );
                })}
            </Col>
          </Row>
        </div>
      )}
    </Container>
  );
};

export default ProfileScreen;
