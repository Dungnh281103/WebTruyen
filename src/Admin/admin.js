import React from "react";
import { Container, Card, Col, Row } from "react-bootstrap";

export default function AdminScreen() {
  return (
    <Container fluid className="mt-4">
      <h2 className="mb-4">Tổng quan</h2>

      <Row className="g-4">
        {/* Statistical Cards */}
        {[
          {
            title: "Tổng truyện",
            value: 120,
            icon: "fas fa-book text-primary",
          },
          {
            title: "Tổng chương",
            value: 1_250,
            icon: "fas fa-file-alt text-success",
          },
          { title: "Người dùng", value: 3_820, icon: "fas fa-users text-info" },
          {
            title: "Lượt xem hôm nay",
            value: 8_400,
            icon: "fas fa-eye text-warning",
          },
        ].map((card, idx) => (
          <Col key={idx} xs={12} sm={6} md={3}>
            <Card className="h-100 shadow-sm border-0">
              <Card.Body className="d-flex flex-column align-items-center">
                <i className={`${card.icon} fs-1 mb-3`}></i>
                <Card.Title className="fs-5 text-center">
                  {card.title}
                </Card.Title>
                <Card.Text className="display-6 fw-bold mt-2">
                  {card.value.toLocaleString()}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Row className="mt-5">
        <Col md={7}>
          <h3 className="mb-3">Hoạt động gần đây</h3>
          <Card className="shadow-sm border-0">
            <Card.Body className="p-3 activity-list">
              <ul className="list-unstyled mb-0">
                <li className="py-2 border-bottom">
                  <i className="fas fa-plus-circle text-success me-2"></i>
                  <span className="fw-bold">Thêm truyện mới:</span> "Tiểu Thuyết
                  Kiếm Hiệp"
                  <small className="d-block text-muted ms-4 mt-1">
                    bởi Admin - 2 giờ trước
                  </small>
                </li>
                <li className="py-2 border-bottom">
                  <i className="fas fa-edit text-primary me-2"></i>
                  <span className="fw-bold">Chương mới cập nhật:</span> "Chương
                  42 - Thế Giới Mới"
                  <small className="d-block text-muted ms-4 mt-1">
                    bởi NguyenVanA - 4 giờ trước
                  </small>
                </li>
                <li className="py-2 border-bottom">
                  <i className="fas fa-user-plus text-warning me-2"></i>
                  <span className="fw-bold">Người dùng đăng ký:</span>{" "}
                  john.doe@example.com
                  <small className="d-block text-muted ms-4 mt-1">
                    5 giờ trước
                  </small>
                </li>
                <li className="py-2 border-bottom">
                  <i className="fas fa-comment text-info me-2"></i>
                  <span className="fw-bold">Bình luận mới:</span> tại "Tình Yêu
                  Thời Hiện Đại"
                  <small className="d-block text-muted ms-4 mt-1">
                    bởi TranThiB - 7 giờ trước
                  </small>
                </li>
                <li className="py-2">
                  <i className="fas fa-exclamation-triangle text-danger me-2"></i>
                  <span className="fw-bold">Báo cáo vi phạm:</span> Nội dung
                  không phù hợp
                  <small className="d-block text-muted ms-4 mt-1">
                    bởi reader123 - 9 giờ trước
                  </small>
                </li>
              </ul>
            </Card.Body>
          </Card>
        </Col>

        <Col md={5}>
          <h3 className="mb-3">Thống kê nhanh</h3>
          <Card className="shadow-sm border-0 h-100">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
                <span>Truyện mới trong tháng</span>
                <span className="fw-bold">24</span>
              </div>
              <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
                <span>Chương mới trong tuần</span>
                <span className="fw-bold">156</span>
              </div>
              <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
                <span>Người dùng hoạt động</span>
                <span className="fw-bold">743</span>
              </div>
              {/* Thêm mục thống kê nếu cần */}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
