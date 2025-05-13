import React, { useState } from "react";
import { Outlet, useLocation, Link } from "react-router-dom";
import { Container, Nav, Navbar, Button, Offcanvas } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "../Admin/admin.css";

const AdminLayout = () => {
  const [show, setShow] = useState(false);
  const location = useLocation();
  const toggleOffcanvas = () => setShow(!show);

  // Menu items for sidebar navigation
  const menuItems = [
    { path: "/admin", icon: "fas fa-home", title: "Dashboard" },
    { path: "/admin/story", icon: "fas fa-book", title: "Quản lý truyện" },
    { path: "/admin/users", icon: "fas fa-user", title: "Người dùng" },
    { path: "/admin/stats", icon: "fas fa-chart-line", title: "Thống kê" },
    { path: "/admin/settings", icon: "fas fa-cog", title: "Cài đặt" },
  ];

  // Check if the current path is active
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="admin-wrapper bg-light">
      {/* Top Navbar */}
      <Navbar bg="dark" variant="dark" expand="lg" className="py-2">
        <Container fluid>
          <Button variant="outline-light" onClick={toggleOffcanvas}>
            <i className="fas fa-bars"></i>
          </Button>
          <Navbar.Brand as={Link} to="/admin" className="ms-3">
            Admin Dashboard
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="main-nav" />
          <Navbar.Collapse id="main-nav" className="justify-content-end">
            <Nav>
              <Nav.Link as={Link} to="/">
                Trang chủ
              </Nav.Link>
              <Nav.Link href="#">Hồ sơ</Nav.Link>
              <Nav.Link href="#">Tin nhắn</Nav.Link>
              <Nav.Link href="#">Cài đặt</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Sidebar Offcanvas */}
      <Offcanvas
        show={show}
        onHide={toggleOffcanvas}
        backdrop={true}
        scroll={false}
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Menu</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Nav className="flex-column">
            {menuItems.map((item, index) => (
              <Nav.Item key={index}>
                <Nav.Link
                  as={Link}
                  to={item.path}
                  className={isActive(item.path) ? "active" : ""}
                  onClick={toggleOffcanvas}
                >
                  <i className={`${item.icon} me-2`}></i>
                  {item.title}
                </Nav.Link>
              </Nav.Item>
            ))}
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>

      {/* Main Content */}
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
