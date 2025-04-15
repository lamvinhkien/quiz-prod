import _ from 'lodash'
import { useState, useEffect } from 'react';
import { UpdateQuiz, DeleteQuiz } from '../../../Services/QuizAPI';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './QuizInfor.scss';
import ModalDeleteQuiz from './ModalDeleteQuiz';
import { GetAllCategory } from '../../../Services/QuizAPI';

const QuizInfo = (props) => {
    const navigate = useNavigate()
    const [valueInput, setValueInput] = useState({
        name: '',
        time: 1,
        numOfCorrect: 1,
        categoryId: ''
    })
    const [isShowDelete, setIsShowDelete] = useState(false)
    const [listCategory, setListCategory] = useState([])

    const handleChangeValue = (event, key) => {
        let _valueInput = _.cloneDeep(valueInput)
        _valueInput[key] = event
        setValueInput(_valueInput)
    }
    const handleShowDelete = () => {
        setIsShowDelete(!isShowDelete)
    }
    const handleDeleteQuiz = async () => {
        let res = await DeleteQuiz(props.data.id)
        if (res.error === 1) {
            toast.error(res.message)
            return
        }
        handleShowDelete()
        navigate('/admin')
        toast.success(res.message)
    }
    const handleUpdateQuiz = async () => {
        let data = {
            id: props.data.id,
            name: valueInput.name,
            time: valueInput.time,
            numOfCorrect: valueInput.numOfCorrect,
            categoryId: valueInput.categoryId ? valueInput.categoryId : ''
        }

        let res = await UpdateQuiz(data)
        if (res.error === 1) {
            toast.error(res.message)
            return
        }
        toast.success(res.message)
    }
    const backToAdmin = () => {
        navigate('/admin')
    }
    const getCategory = async () => {
        let res = await GetAllCategory()
        if (res && res.data) {
            setListCategory(res.data)
        }
    }

    useEffect(() => {
        if (props.data) {
            getCategory()
            if (props.data.Category) {
                setValueInput({
                    name: props.data.name, time: props.data.time,
                    numOfCorrect: props.data.numOfCorrect, categoryId: props.data.Category.id
                })
            }
        }
    }, [props.data.name, props.data.time, props.data.numOfCorrect, props.data.Category])

    return (
        <>
            <div className='container'>
                <div className='QuizInfor-box'>
                    <div className='row align-items-center'>
                        <div className='col-12 col-lg-8'>
                            <label className='fs-4 fw-bold title-color'><i className="fa fa-info-circle"></i> Thông tin bài thi</label>
                        </div>
                        <div className='col-12 col-lg-2 d-flex justify-content-end mt-2 mt-lg-0'>
                            <button className='btn btn-outline-dark w-100' onClick={() => { backToAdmin() }}>
                                <i className="fa fa-undo"></i> Quay lại
                            </button>
                        </div>
                        <div className='col-12 col-lg-2 d-flex justify-content-end mt-2 mt-lg-0'>
                            <button className='btn btn-danger w-100' onClick={() => { handleShowDelete() }}>
                                <i className="fa fa-trash-o"></i> Xoá bài thi
                            </button>
                        </div>
                    </div>
                    <hr />
                    <div className="row align-items-end">
                        <div className='col-12 col-lg-10'>
                            <label>Tên bài thi:</label>
                            <input type="text" className='form-control mt-1' value={valueInput.name} placeholder='Nhập tên bài thi...'
                                onChange={(event) => { handleChangeValue(event.target.value, 'name') }}
                            />
                        </div>
                        <div className='col-12 col-lg-2 mt-3 mt-lg-0'>
                            <button className='btn btn-success w-100' onClick={() => { handleUpdateQuiz() }}>
                                <i className="fa fa-floppy-o"></i> Lưu
                            </button>
                        </div>
                    </div>
                    <div className="row align-items-center mt-2">
                        <div className="col-12 col-lg-4">
                            <label>Thời gian hoàn thành (Phút):</label>
                            <input type="number" className='form-control mt-1' value={valueInput.time} min={1}
                                onChange={(event) => { handleChangeValue(event.target.value, 'time') }}
                            />
                        </div>
                        <div className="col-12 col-lg-4 mt-2 mt-lg-0">
                            <label>Số câu phải đúng:</label>
                            <input type="number" className='form-control mt-1' value={valueInput.numOfCorrect} min={1}
                                onChange={(event) => { handleChangeValue(event.target.value, 'numOfCorrect') }}
                            />
                        </div>
                        <div className="col-12 col-lg-4 mt-2 mt-lg-0">
                            <label>Danh mục bài thi:</label>
                            <select className='form-select mt-1' value={valueInput.categoryId || ''}
                                onChange={(event) => { handleChangeValue(event.target.value, 'categoryId') }}>
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
                        </div>
                    </div>
                </div>
            </div>

            <ModalDeleteQuiz
                show={isShowDelete}
                hide={handleShowDelete}
                delete={handleDeleteQuiz}
            />

        </>
    )
}

export default QuizInfo;