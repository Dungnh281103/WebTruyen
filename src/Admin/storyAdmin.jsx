import React, { useEffect, useState } from "react";
import {
  Container,
  Card,
  Table,
  Badge,
  Form,
  Pagination,
  Button,
  Modal,
  Row,
  Col,
  Alert,
} from "react-bootstrap";
import { fetchStories, updateStory } from "../apis/storyServices";
// import "./StoryAdmin.scss";

export default function StoryAdmin() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Modal edit
  const [showEditModal, setShowEditModal] = useState(false);
  const [editStory, setEditStory] = useState(null);
  const [saveError, setSaveError] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadStories();
  }, []);

  const loadStories = async (title = "") => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchStories(title);
      setStories(data);
    } catch (err) {
      console.error(err);
      setError(err.message || "Lỗi khi tải truyện");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    loadStories(value);
  };

  const startIdx = (currentPage - 1) * itemsPerPage;
  const paginatedStories = stories.slice(startIdx, startIdx + itemsPerPage);
  const totalPages = Math.ceil(stories.length / itemsPerPage);

  const handlePageChange = (page) => setCurrentPage(page);

  const getStatusVariant = (status) => {
    switch (status) {
      case "Đang ra":
        return "success";
      case "Hoàn thành":
        return "primary";
      case "Tạm ngưng":
        return "warning";
      default:
        return "secondary";
    }
  };

  // Edit click
  const openEdit = (story) => {
    setEditStory({ ...story });
    setSaveError(null);
    setShowEditModal(true);
  };

  const closeEdit = () => {
    setShowEditModal(false);
    setEditStory(null);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditStory((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveError(null);
    try {
      await updateStory(editStory.id, {
        title: editStory.title,
        author: editStory.author,
        coverUrl: editStory.coverUrl,
        description: editStory.description,
        status: editStory.status,
        categoryNames: editStory.categories,
        tagNames: editStory.tags,
      });
      closeEdit();
      loadStories(searchTerm);
    } catch (err) {
      console.error(err);
      setSaveError(err.message || "Lỗi khi lưu thay đổi");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Container fluid className="story-admin mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Quản lý truyện</h2>
        <Form.Control
          type="text"
          placeholder="Tìm kiếm..."
          value={searchTerm}
          onChange={handleSearch}
          style={{ width: 300 }}
        />
      </div>

      {loading && <p>Đang tải truyện...</p>}
      {error && <Alert variant="danger">{error}</Alert>}

      {!loading && !error && (
        <Card className="shadow-sm border-0">
          <Card.Body className="p-0">
            <Table responsive hover className="mb-0">
              <thead className="bg-light">
                <tr>
                  <th>STT</th>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Chapters</th>
                  <th>Status</th>
                  <th>Views</th>
                  <th>Updated</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedStories.map((story, idx) => (
                  <tr key={story.id}>
                    <td>{startIdx + idx + 1}</td>
                    <td>{story.title}</td>
                    <td>{story.author}</td>
                    <td>{story.totalChapters}</td>
                    <td>
                      <Badge bg={getStatusVariant(story.status)}>
                        {story.status}
                      </Badge>
                    </td>
                    <td>{story.totalViews.toLocaleString()}</td>
                    <td>{new Date(story.updatedAt).toLocaleDateString()}</td>
                    <td>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        className="me-2"
                        onClick={() => openEdit(story)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => console.log("Delete", story.id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
                {paginatedStories.length === 0 && (
                  <tr>
                    <td colSpan={8} className="text-center py-3">
                      No stories
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      )}

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="d-flex justify-content-center mt-3">
          <Pagination>
            <Pagination.Prev
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
            />
            {Array.from({ length: totalPages }).map((_, i) => (
              <Pagination.Item
                key={i + 1}
                active={currentPage === i + 1}
                onClick={() => handlePageChange(i + 1)}
              >
                {i + 1}
              </Pagination.Item>
            ))}
            <Pagination.Next
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
            />
          </Pagination>
        </div>
      )}

      {/* Edit Modal */}
      <Modal show={showEditModal} onHide={closeEdit} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Edit Story</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {saveError && <Alert variant="danger">{saveError}</Alert>}
          {editStory && (
            <Form>
              <Row>
                <Col md={6} className="mb-3">
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    name="title"
                    value={editStory.title}
                    onChange={handleEditChange}
                  />
                </Col>
                <Col md={6} className="mb-3">
                  <Form.Label>Author</Form.Label>
                  <Form.Control
                    name="author"
                    value={editStory.author}
                    onChange={handleEditChange}
                  />
                </Col>
              </Row>
              <Row>
                <Col md={6} className="mb-3">
                  <Form.Label>Cover URL</Form.Label>
                  <Form.Control
                    name="coverUrl"
                    value={editStory.coverUrl}
                    onChange={handleEditChange}
                  />
                </Col>
                <Col md={6} className="mb-3">
                  <Form.Label>Status</Form.Label>
                  <Form.Select
                    name="status"
                    value={editStory.status}
                    onChange={handleEditChange}
                  >
                    <option>Đang ra</option>
                    <option>Hoàn thành</option>
                    <option>Tạm ngưng</option>
                  </Form.Select>
                </Col>
              </Row>
              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="description"
                  value={editStory.description}
                  onChange={handleEditChange}
                />
              </Form.Group>
              <Row>
                <Col md={6} className="mb-3">
                  <Form.Label>Categories (comma separated)</Form.Label>
                  <Form.Control
                    name="categories"
                    value={editStory.categories.join(",")}
                    onChange={(e) =>
                      setEditStory((prev) => ({
                        ...prev,
                        categories: e.target.value
                          .split(",")
                          .map((s) => s.trim()),
                      }))
                    }
                  />
                </Col>
                <Col md={6} className="mb-3">
                  <Form.Label>Tags (comma separated)</Form.Label>
                  <Form.Control
                    name="tags"
                    value={editStory.tags.join(",")}
                    onChange={(e) =>
                      setEditStory((prev) => ({
                        ...prev,
                        tags: e.target.value.split(",").map((s) => s.trim()),
                      }))
                    }
                  />
                </Col>
              </Row>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeEdit}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
