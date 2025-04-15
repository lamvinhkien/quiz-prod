import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import { CreateQuiz } from '../../../Services/QuizAPI';
import { toast } from 'react-toastify';

const ModalAddQuiz = (props) => {
    const [name, setName] = useState('')
    const [time, setTime] = useState(1)
    const [numOfCorrect, setNumOfCorrect] = useState(1)
    const [categoryId, setCategoryId] = useState('')
    const [listCategory, setListCategory] = useState([])

    const handleClose = () => {
        props.handleShow()
        setName('')
        setNumOfCorrect(1)
        setTime(1)
    }
    const handleChangeName = (event) => {
        setName(event)
    }
    const handleChangeTime = (event) => {
        setTime(event)
    }
    const handleChangeNumOfCorrect = (event) => {
        setNumOfCorrect(event)
    }
    const handleChangeCategory = (event) => {
        setCategoryId(event)
    }
    const handleAddQuiz = async () => {
        let data = {
            name: name,
            time: time,
            numOfCorrect: numOfCorrect,
            categoryId: categoryId ? categoryId : ''
        }

        let res = await CreateQuiz(data)
        if (res.error === 1) {
            toast.error(res.message)
            return
        }
        handleClose()
        toast.success(res.message)
    }

    useEffect(() => {
        if (props.listCategory && props.listCategory.length > 0) {
            setListCategory(props.listCategory)
        }
    }, [props.listCategory])

    return (
        <Modal show={props.show} onHide={handleClose} size='lg'>
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Thêm bài thi
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="d-flex justify-content-center w-100">
                <Container>
                    <Row>
                        <Col xs={12} md={12}>
                            <label className='form-label'>Tên bài thi:</label>
                            <input value={name} placeholder='Nhập tên bài thi...' className='form-control'
                                onChange={(event) => { handleChangeName(event.target.value) }}
                            />
                        </Col>
                        <Col xs={12} md={12} className='mt-3'>
                            <label className='form-label'>Danh mục bài thi:</label>
                            <select className='form-select' onChange={(event) => { handleChangeCategory(event.target.value) }}>
                                <option value=''>Chọn danh mục bài thi</option>
                                {
                                    listCategory && listCategory.length > 0 ?
                                        listCategory.map((item, index) => {
                                            return (
                                                <option key={index} value={item.id}>{item.name}</option>
                                            )
                                        })
                                        :
                                        <option value=''>Không có danh mục bài thi</option>
                                }
                            </select>
                        </Col>
                        <Col xs={12} md={6} className='mt-3'>
                            <label className='form-label'>Thời gian hoàn thành (Phút):</label>
                            <input type='number' value={time} className='form-control' min={1}
                                onChange={(event) => { handleChangeTime(event.target.value) }}
                            />
                        </Col>
                        <Col xs={12} md={6} className='mt-3'>
                            <label className='form-label'>Số câu phải đúng:</label>
                            <input type='number' value={numOfCorrect} className='form-control' min={1}
                                onChange={(event) => { handleChangeNumOfCorrect(event.target.value) }}
                            />
                        </Col>
                    </Row>
                </Container>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={handleClose} variant='secondary'>Đóng</Button>
                <Button onClick={() => { handleAddQuiz() }} variant='success'>Thêm</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default ModalAddQuiz;