import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import uploadImg from '../../../Assets/upload-image.jpg';
import { useParams } from 'react-router-dom';
import { CreateQuestionAnswer } from '../../../Services/QuizAPI';
import _ from 'lodash'
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-toastify';

const ModalAddQuestion = (props) => {
    const params = useParams()
    const [name, setName] = useState('')
    const [failedPoint, setFailedPoint] = useState(false)
    const [image, setImage] = useState('')
    const defaultList = { answer: { description: '', correctAnswer: false }, answer2: { description: '', correctAnswer: false } }
    const [listAnswer, setListAnswer] = useState({
        answer: { description: '', correctAnswer: false },
        answer2: { description: '', correctAnswer: false },
    })
    const [previewImage, setPreviewImage] = useState(uploadImg)

    const handleClose = () => {
        props.handleShow()
        setName('')
        setImage('')
        setFailedPoint(false)
        setPreviewImage(uploadImg)
        setListAnswer(defaultList)
    }
    const handleChangeName = (event) => {
        setName(event)
    }
    const handleChangeFailedPoint = (event) => {
        setFailedPoint(event)
    }
    const handleChangeImage = (event) => {
        if (event) {
            let img = URL.createObjectURL(event)
            setImage(event)
            setPreviewImage(img)
            document.getElementById("img").value = null;
        }
    }
    const handleDeleteImg = () => {
        setImage('')
        setPreviewImage(uploadImg)
    }
    const addMoreAnswer = () => {
        let _listAnswer = _.cloneDeep(listAnswer)
        _listAnswer['answer' + uuidv4()] = {
            description: '',
            correctAnswer: false,
        }
        setListAnswer(_listAnswer)
    }
    const deleteAnswer = (key) => {
        let _listAnswer = _.cloneDeep(listAnswer)
        delete _listAnswer[key]
        setListAnswer(_listAnswer)
    }
    const handleChangeAnswer = (event, key, value) => {
        let _listAnswer = _.cloneDeep(listAnswer)
        _listAnswer[key][value] = event
        setListAnswer(_listAnswer)
    }
    const handleCorrect = (key, value) => {
        let _listAnswer = _.cloneDeep(listAnswer)
        Object.keys(_listAnswer).forEach((key2, value2) => {
            _listAnswer[key2]['correctAnswer'] = false
        })
        _listAnswer[key][value] = true
        setListAnswer(_listAnswer)
    }
    const handleAddQuestionAnswer = async () => {
        let checkCorrect = false
        let checkValue = true
        Object.entries(listAnswer).forEach(([key, value], index) => {
            if (value.correctAnswer === true) {
                checkCorrect = true
            }
            if (value.description === '') {
                checkValue = false
            }
        })

        if (checkValue === false) {
            toast.error('Vui lòng nhập đầy đủ thông tin.')
            return
        }
        if (checkCorrect === false) {
            toast.error('Vui lòng chọn một câu trả lời chính xác.')
            return
        }

        let list = JSON.stringify(listAnswer)
        const formData = new FormData()
        formData.append('name', name)
        formData.append('failedPoint', failedPoint)
        formData.append('questionImg', image)
        formData.append('quizId', params.id)
        formData.append('listAnswer', list)

        let res = await CreateQuestionAnswer(formData)
        if (res.error === 1) {
            toast.error(res.message)
            return
        }

        if (res.error === 0) {
            toast.success(res.message)
            handleClose()
            return
        }
    }

    return (
        <Modal show={props.show} onHide={handleClose} size='xl'>
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Thêm câu hỏi và các câu trả lời
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="d-flex justify-content-center">
                <Container>
                    <Row>
                        <Col xs={12} lg={6} className="">
                            <div className="d-flex justify-content-between align-items-center">
                                <label className="form-label">Hình ảnh:</label>
                                <div>
                                    <button
                                        className="btn btn-sm btn-danger"
                                        onClick={() => {
                                            handleDeleteImg();
                                        }}
                                    >
                                        Xoá hình ảnh
                                    </button>
                                </div>
                            </div>
                            <div className="mt-1 text-center">
                                <label htmlFor="img" className="btn">
                                    <img
                                        src={previewImage}
                                        width={"100%"}
                                        style={{ maxHeight: "200px" }}
                                        alt=""
                                    />
                                </label>
                                <input
                                    type="file"
                                    hidden
                                    id="img"
                                    onChange={(event) => {
                                        handleChangeImage(event.target.files[0]);
                                    }}
                                />
                            </div>
                        </Col>
                        <Col xs={12} lg={6} className='mt-3 mt-lg-0'>
                            <Row>
                                <Col xs={12} className="">
                                    <label className="form-label">Tên câu hỏi:</label>
                                    <textarea
                                        value={name}
                                        placeholder="Nhập tên câu hỏi tại đây..."
                                        className="form-control"
                                        onChange={(event) => {
                                            handleChangeName(event.target.value);
                                        }}
                                        rows={5}
                                    ></textarea>
                                </Col>
                                <Col xs={12} className="mt-3">
                                    <label className="form-label">Đây là câu điểm liệt?</label>
                                    <select
                                        className="form-select"
                                        value={failedPoint}
                                        onChange={(event) => {
                                            handleChangeFailedPoint(event.target.value);
                                        }}
                                    >
                                        <option value={true}>Có</option>
                                        <option value={false}>Không</option>
                                    </select>
                                </Col>
                            </Row>
                        </Col>
                        <Col xs={12} lg={12} className='mt-3 mt-lg-2'>
                            <label className="form-label">Các câu trả lời:</label>
                            {Object.entries(listAnswer).map(([key, value], index) => {
                                return (
                                    <Col xs={12} lg={12} key={key} className="mb-3">
                                        <div className="d-flex align-items-center">
                                            <div>
                                                <label
                                                    htmlFor={`correctId-${key}`}
                                                    className={
                                                        value.correctAnswer === true
                                                            ? "btn btn-success"
                                                            : "btn btn-outline-success"
                                                    }
                                                >
                                                    <i className="fa fa-check"></i>
                                                </label>
                                                <input
                                                    type="radio"
                                                    name="correct"
                                                    id={`correctId-${key}`}
                                                    hidden
                                                    onClick={() => {
                                                        handleCorrect(key, "correctAnswer");
                                                    }}
                                                />
                                            </div>
                                            <div style={{ paddingLeft: '7px' }}>
                                                <span className='fw-medium' style={{ fontSize: '17.5px' }}>{index + 1}.</span>
                                            </div>
                                            <input
                                                type="text"
                                                value={value.description}
                                                placeholder="Nhập câu trả lời..."
                                                className="form-control mx-2"
                                                onChange={(event) => {
                                                    handleChangeAnswer(event.target.value, key, "description");
                                                }}
                                            />
                                            <button
                                                className="btn btn-danger"
                                                onClick={() => {
                                                    deleteAnswer(key);
                                                }}
                                            >
                                                <i className="fa fa-trash-o"></i>
                                            </button>
                                        </div>
                                    </Col>
                                );
                            })}
                            <div className="text-center mt-2">
                                <Button
                                    onClick={() => {
                                        addMoreAnswer();
                                    }}
                                    variant="success"
                                >
                                    Thêm câu trả lời
                                </Button>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={handleClose} variant='secondary'>Đóng</Button>
                <Button onClick={() => { handleAddQuestionAnswer() }} variant='success'>Thêm</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default ModalAddQuestion;