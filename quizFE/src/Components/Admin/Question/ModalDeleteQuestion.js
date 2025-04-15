import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function ModalDeleteQuestion(props) {
    return (
        <Modal show={props.show} onHide={props.hide} centered>
            <Modal.Header closeButton>
                <Modal.Title>Xác nhận xoá câu hỏi</Modal.Title>
            </Modal.Header>
            <Modal.Body>Bạn có chắc muốn xoá câu hỏi này?</Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={props.hide}>
                    Đóng
                </Button>
                <Button variant="danger" onClick={props.delete}>
                    Xoá
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default ModalDeleteQuestion;