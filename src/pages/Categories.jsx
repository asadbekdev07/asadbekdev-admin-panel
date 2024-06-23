import { Modal, Popover, Button, Pagination, message, Table } from 'antd';
import React, { useEffect, useState } from 'react';

function Categories() {
  const [category, setCategory] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openPopover, setOpenPopover] = useState(null);
  const [id, setId] = useState(null);


  const hidePopover = () => {
    setOpenPopover(null);
  };

  const handlePopoverOpenChange = (newOpen, id) => {
    setOpenPopover(newOpen ? id : null);
  };

  const [data, setData] = useState({ name_en: '', name_ru: '', images: null });
  const urlImage = 'https://autoapi.dezinfeksiyatashkent.uz/api/uploads/images/';
  const token = localStorage.getItem("accessToken");

  const getCategory = () => {
    fetch('https://autoapi.dezinfeksiyatashkent.uz/api/categories')
      .then((res) => res.json())
      .then((category) => {
        setCategory(category.data);
      });
  };

  const createForm = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name_en', data.name_en);
    formData.append('name_ru', data.name_ru);
    formData.append('images', data.images);
    fetch('https://autoapi.dezinfeksiyatashkent.uz/api/categories', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method: 'POST',
      body: formData,
    })
      .then((res) => res.json())
      .then((res) => {
        getCategory();
        handleModalClose();
        resetFormData();
        message.success("Added successfully")
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getCategory();
  }, []);

  const handleModalOpen = () => {
    setOpenModal(true);
  };

  const handleModalClose = () => {
    setOpenModal(false);
  };

  const handleEditModalOpen = (item) => {
    setId(item.id)
    setOpenEditModal(true);
    setData({...data, name_en: item.name_en, name_ru: item.name_ru, images: item.image_src})
  };

  const resetFormData = () => {
    setData({ name_en: '', name_ru: '', images: null });
  };

  const editCategory = (e) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append('name_en', data.name_en)
    formData.append('name_ru', data.name_ru)
    formData.append('images', data.images)
    fetch(`https://autoapi.dezinfeksiyatashkent.uz/api/categories/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method: "PUT",
      body: formData
    }).then(res=>res.json()).then(res=>{
      if(res.success){
        message.success("O'zgartirildi")
        getCategory();
        handleEditModalClose();
      } else {
        message.error("Xatolik")
      }
    }).catch(err=>{
      console.log(err);
    })
  }

  const handleEditModalClose = () => {
    setOpenEditModal(false);
  };

  const handleDelete = (id) => {
    fetch(`https://autoapi.dezinfeksiyatashkent.uz/api/categories/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then(() => {
        getCategory();
        hidePopover();
        message.success("O'chirildi")
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const columns = [
    {
      title: 'Name_en',
      dataIndex: 'name_en',
      key: 'name_en',
    },
    {
      title: 'Name_ru',
      dataIndex: 'name_ru',
      key: 'name_ru',
    },
    {
      title: 'Images',
      dataIndex: 'images',
      key: 'images',
      render: (text, record) => (
        <img className="w-[50px]" src={`${urlImage}${record.image_src}`} alt="Error" />
      ),
    },
    {
      title: 'Actions',
      dataIndex: 'action',
      key: 'action',
      render: (text, record) => (
        <>
          <Button className="mr-[10px]" type="primary" onClick={() => handleEditModalOpen(record)}>Edit</Button>

          <Popover
                  placement="left"
                  content={
                    <div>
                      <p>Are you sure you want to delete?</p>
                      <div className="flex justify-end mt-[10px]">
                        <Button size="small" onClick={hidePopover} className="mr-[10px]">
                          No
                        </Button>
                        <Button type="primary" size="small" onClick={() => handleDelete(record.id)}>
                          Yes
                        </Button>
                      </div>
                    </div>
                  }
                  title="Are you sure"
                  trigger="click"
                  open={openPopover === record.id}
                  onOpenChange={(newOpen) => handlePopoverOpenChange(newOpen, record.id)}
                >
                  <Button type="primary" danger>Delete</Button>
                </Popover>
        </>
      ),
    },
  ];

  const dataSource = category.map((category) => ({
    key: category.id,
    ...category,
  }));


  return (
    <div>
      <div className="flex justify-between mb-[20px]">
        <h2 className="text-3xl font-bold">Category</h2>
        <Button className="rounded-md text-white bg bg-[#1677ff]" onClick={handleModalOpen}>
          Add a Category
        </Button>
      </div>

      <div>
        <Table dataSource={dataSource} columns={columns} pagination={{ pageSize: 5 }} />
      </div>




      <Modal
        title="Qo'shish"
        open={openModal}
        onCancel={handleModalClose}
        footer={null}
      >
        <form onSubmit={createForm}>
          <div className="mb-[20px]">
            <label className="block mb-[5px]">Name (English)</label>
            <input
              type="text"
              value={data.name_en}
              onChange={(e) => setData({ ...data, name_en: e.target.value })}
              className="w-full p-[8px] border border-[#e5e7eb] rounded"
            />
          </div>
          <div className="mb-[20px]">
            <label className="block mb-[5px]">Name (Russian)</label>
            <input
              type="text"
              value={data.name_ru}
              onChange={(e) => setData({ ...data, name_ru: e.target.value })}
              className="w-full p-[8px] border border-[#e5e7eb] rounded"
            />
          </div>
          <div className="mb-[20px]">
            <label className="block mb-[5px]">Image</label>
            <input
              type="file"
              className="w-full p-[8px] border border-[#e5e7eb] rounded"
              onChange={(e) => setData({ ...data, images: e.target.files[0] })}
            />
          </div>
          <div className="text-right">
            <button type="submit" className="text-white bg bg-[#1677ff] p-[10px_20px] rounded-[8px]">
              Add Category
            </button>
          </div>
        </form>
      </Modal>

      {/* EDIT MODAL  */}

      <Modal
        title="Tahrirlash"
        open={openEditModal}
        onOk={handleEditModalOpen}
        onCancel={handleEditModalClose}
        footer={null}
      >
        <form onSubmit={editCategory}>
          <div className="mb-[20px]">
            <label className="block mb-[5px]">Name (English)</label>
            <input
              type="text"
              value={data.name_en}
              className="w-full p-[8px] border border-[#e5e7eb] rounded"
              onChange={(e)=>setData({...data, name_en:e.target.value})}
            />
          </div>
          <div className="mb-[20px]">
            <label className="block mb-[5px]">Name (Russian)</label>
            <input
              type="text"
              value={data.name_ru}
              className="w-full p-[8px] border border-[#e5e7eb] rounded"
              onChange={(e)=>setData({...data, name_ru:e.target.value})}
            />
          </div>
          <div className="mb-[20px]">
            <label className="block mb-[5px]">Image</label>
            <input
              type="file"
              className="w-full p-[8px] border border-[#e5e7eb] rounded"
              onChange={(e)=>setData({...data, images:e.target.files[0]})}
            />
            {data.images && (
              <img className='w-[100px] mt-[15px]' src={`${urlImage}${data.images}`} alt="Selected Image" />
            )}
          </div>
          <div className="text-right">
            <button type="submit" className="text-white bg bg-[#1677ff] p-[10px_20px] rounded-[8px]">
              Edit
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default Categories;
