import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Container from 'react-bootstrap/Container';
import { toast } from 'react-toastify';
import React, { useEffect, useState } from 'react';
import { GetCategoryPagination, CreateCategory, UpdateCategory, DeleteCategory } from '../../../Services/QuizAPI';
import ReactPaginate from "react-paginate";
import ModalDeleteCategory from './ModalDeleteCategory';

const ModalCategory = (props) => {
    const [idCategory, setIdCategory] = useState('')
    const [name, setName] = useState('')
    const [listCategory, setListCategory] = useState([])
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(4)
    const [offset, setOffset] = useState(0)
    const [totalPage, setTotalPage] = useState(0)
    const [showDelete, setShowDelete] = useState(false)

    const handleChangeName = (event) => {
        setName(event)
    }
    const handleClose = () => {
        props.handleShow()
        setName('')
        setIdCategory('')
    }
    const handlePageClick = (event) => {
        setPage(event.selected + 1)
    }
    const handleGetCategory = async () => {
        let res = await GetCategoryPagination(page, limit)
        if (res && res.error === 0) {
            setListCategory(res.data.category)
            setOffset(res.data.offset)
            setTotalPage(res.data.totalPage)
        }
    }
    const handleChoose = (id, name) => {
        setIdCategory(id)
        setName(name)
    }
    const handleUnChoose = () => {
        setIdCategory('')
        setName('')
    }
    const handleCreate = async () => {
        if (name === '') return toast.error("Vui lòng nhập tên danh mục.")
        let res = await CreateCategory(name)
        if (res && res.error === 0) {
            handleGetCategory()
            setName('')
            setIdCategory('')
            toast.success(res.message)
            return
        }
        toast.error(res.message)
    }
    const handleUpdate = async () => {
        if (idCategory === '') return toast.error("Vui lòng chọn một danh mục để cập nhật.")
        if (name === '') return toast.error("Vui lòng nhập tên danh mục.")
        let res = await UpdateCategory(idCategory, name)
        if (res && res.error === 0) {
            handleGetCategory()
            setName('')
            setIdCategory('')
            toast.success(res.message)
            return
        }
        toast.error(res.message)
    }
    const handleDelete = async () => {
        let res = await DeleteCategory(idCategory)
        if (res && res.error === 0) {
            handleGetCategory()
            setName('')
            setIdCategory('')
            setShowDelete(!showDelete)
            toast.success(res.message)
            return
        }
        toast.error(res.message)
    }
    const handleShowDelete = () => {
        if (idCategory === '') return toast.error("Vui lòng chọn một danh mục để xoá.")
        setShowDelete(!showDelete)
    }

    useEffect(() => {
        handleGetCategory()
    }, [page])

    return (
        <>
            <Modal show={props.show} onHide={handleClose} size='lg'>
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Quản lý danh mục
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Container>
                        <div style={{ height: '275px' }} className='table-responsive text-nowrap'>
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>STT</th>
                                        <th>Tên danh mục</th>
                                        <th>Chọn</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {listCategory.length > 0 ? listCategory.map((item, index) => {
                                        return (
                                            <tr key={index} className={item.id === idCategory ? "table-info" : ''}>
                                                <td>{index + 1 + offset}</td>
                                                <td className='w-100'>{item.name}</td>
                                                <td>
                                                    {
                                                        idCategory !== '' && item.id === idCategory ?
                                                            <>
                                                                <button className="btn btn-danger w-100"
                                                                    onClick={() => { handleUnChoose() }}
                                                                ><i className="fa fa-times fs-5"></i></button>
                                                            </>
                                                            :
                                                            <>
                                                                <button className="btn btn-primary w-100"
                                                                    onClick={() => { handleChoose(item.id, item.name) }}
                                                                ><i className="fa fa-pencil-square-o fs-5"></i></button>
                                                            </>
                                                    }
                                                </td>
                                            </tr>
                                        )
                                    }) : <></>}
                                </tbody>
                            </table>
                        </div>
                        <div className="d-flex justify-content-center mt-1">
                            {
                                totalPage > 0 &&
                                <ReactPaginate
                                    nextLabel="Sau >"
                                    onPageChange={handlePageClick}
                                    pageRangeDisplayed={3}
                                    marginPagesDisplayed={2}
                                    pageCount={totalPage}
                                    previousLabel="< Trước"
                                    pageClassName="page-item"
                                    pageLinkClassName="page-link"
                                    previousClassName="page-item"
                                    previousLinkClassName="page-link"
                                    nextClassName="page-item"
                                    nextLinkClassName="page-link"
                                    breakLabel="..."
                                    breakClassName="page-item"
                                    breakLinkClassName="page-link"
                                    containerClassName="pagination"
                                    activeClassName="active"
                                    renderOnZeroPageCount={null}
                                />
                            }
                        </div>
                        <div className='row align-items-center mt-2'>
                            <div className='col-lg-8'>
                                <div className='input-group'>
                                    <span className='input-group-text'>Tên danh mục:</span>
                                    <input
                                        type='text'
                                        className='form-control'
                                        value={name}
                                        placeholder='Nhập tên danh mục...'
                                        onChange={(event) => {
                                            handleChangeName(event.target.value);
                                        }}
                                    />
                                </div>
                            </div>
                            <div className='col-lg-4 d-flex justify-content-end mt-2 mt-lg-0'>
                                <button className='btn btn-warning me-1' onClick={() => { handleUpdate(); }}>
                                    Cập nhật
                                </button>
                                <button className='btn btn-danger me-1' onClick={() => { handleShowDelete(); }}>
                                    Xoá
                                </button>
                                <button className='btn btn-success' onClick={() => { handleCreate(); }}>
                                    Thêm
                                </button>
                            </div>
                        </div>
                    </Container>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={handleClose} variant='secondary'>Đóng</Button>
                </Modal.Footer>
            </Modal>

            <ModalDeleteCategory
                show={showDelete}
                hide={handleShowDelete}
                delete={handleDelete}
            />
        </>
    )
}

export default ModalCategory;