import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import uploadImg from '../../../Assets/upload-image.jpg';
import { UpdateQuestionAnswer, DeleteQuestion } from '../../../Services/QuizAPI';
import _ from 'lodash'
import { v4 as uuidv4 } from 'uuid';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import ModalDeleteQuestion from './ModalDeleteQuestion';

const ModalEditQuestion = (props) => {
    const params = useParams()
    const [name, setName] = useState('')
    const [image, setImage] = useState('')
    const [imgDelete, setImgDelete] = useState('no')
    const [failedPoint, setFailedPoint] = useState(false)
    const [listAnswer, setListAnswer] = useState({})
    const [previewImage, setPreviewImage] = useState(uploadImg)
    const [showDelete, setShowDelete] = useState(false)

    const handleClose = () => {
        props.handleClose()
        setName('')
        setImage('')
        setFailedPoint(false)
        setPreviewImage(uploadImg)
        setListAnswer({})
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
            document.getElementById("imgE").value = null
            setImgDelete('no')
        }
    }
    const handleDeleteImg = () => {
        setImage('')
        setPreviewImage(uploadImg)
        setImgDelete('yes')
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
    const buildData = async (name, image, list, failedPoint) => {
        if (name || image || list) {
            let lengthObj = Object.entries(list).length;
            let keyObj = {}

            setName(name)
            setPreviewImage(image !== '' ? image : '')
            setFailedPoint(failedPoint)

            for (let index1 = 0; index1 < lengthObj; index1++) {
                let valueList = {}
                Object.entries(list).forEach(([key, value], index2) => {
                    if (index1 === index2) {
                        valueList = value
                    }
                })
                keyObj['answer' + index1] = valueList
                setListAnswer(keyObj)
            }
        }

    }
    const handleEditQuestionAnswer = async () => {
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
        formData.append('id', props.data ? props.data.id : '')
        formData.append('name', name)
        formData.append('failedPoint', failedPoint)
        formData.append('questionImg', image)
        formData.append('quizId', params.id)
        formData.append('listAnswer', list)
        formData.append('imgDelete', imgDelete)

        let res = await UpdateQuestionAnswer(formData)
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
    const handleShowDelete = () => {
        setShowDelete(!showDelete)
    }
    const handleDelete = async () => {
        if (props.data && props.data.id) {
            let res = await DeleteQuestion(props.data.id)
            if (res.error === 1) {
                toast.error(res.message)
                return
            }
            handleShowDelete()
            handleClose()
            toast.success(res.message)
        }
    }

    useEffect(() => {
        if (props.data) {
            if (props.data.name || props.data.image || props.data.Answers || props.data.failedPoint) {
                buildData(props.data.name, props.data.image, props.data.Answers, props.data.failedPoint)
            }
        }
    }, [props.data.name, props.data.image, props.data.Answers, props.data.failedPoint])

    return (
        <>
            <Modal show={props.show} onHide={handleClose} size='xl'>
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Cập nhật câu hỏi và các câu trả lời
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="d-flex justify-content-center w-100">
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
                                    <label htmlFor="imgE" className="btn">
                                        <img
                                            src={previewImage !== "" ? previewImage : uploadImg}
                                            width={"100%"}
                                            style={{ maxHeight: "200px" }}
                                            alt=""
                                        />
                                    </label>
                                    <input
                                        type="file"
                                        hidden
                                        id="imgE"
                                        onChange={(event) => {
                                            handleChangeImage(event.target.files[0]);
                                        }}
                                    />
                                </div>
                            </Col>
                            <Col xs={12} lg={6} className="mt-3 mt-lg-0">
                                <Row>
                                    <Col xs={12} className="">
                                        <label className="form-label">Tên câu hỏi:</label>
                                        <textarea
                                            placeholder="Nhập tên câu hỏi tại đây..."
                                            className="form-control"
                                            onChange={(event) => {
                                                handleChangeName(event.target.value);
                                            }}
                                            rows={5}
                                            value={name}
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
                            <Col xs={12} lg={12} className="mt-3 mt-lg-2">
                                <label className="form-label">Các câu trả lời:</label>
                                {Object.entries(listAnswer).map(([key, value], index) => {
                                    return (
                                        <Col xs={12} lg={12} className="mb-3" key={key}>
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
                                                <div style={{ paddingLeft: "7px" }}>
                                                    <span className="fw-medium" style={{ fontSize: "17.5px" }}>
                                                        {index + 1}.
                                                    </span>
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
                    <Button onClick={handleShowDelete} variant='danger'>Xoá</Button>
                    <Button onClick={() => { handleEditQuestionAnswer() }} variant='success'>Lưu</Button>
                </Modal.Footer>
            </Modal>

            <ModalDeleteQuestion
                show={showDelete}
                hide={handleShowDelete}
                delete={handleDelete}
            />
        </>
    )
}

export default ModalEditQuestion;