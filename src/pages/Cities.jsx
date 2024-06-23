import { Modal, Popover, Button, message, Table } from 'antd';
import React, { useEffect, useState } from 'react';

function Cities() {
  const [cities, setCities] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openPopover, setOpenPopover] = useState(null);
  const [id, setId] = useState(null);
  const [data, setData] = useState({ name: '', text: '', images: null });

  const hidePopover = () => {
    setOpenPopover(null);
  };

  const handlePopoverOpenChange = (newOpen, id) => {
    setOpenPopover(newOpen ? id : null);
  };

  const handleImageChange = (e) => {
    setData({ ...data, images: e.target.files[0] });
  };

  const urlImage = 'https://autoapi.dezinfeksiyatashkent.uz/api/uploads/images/';
  const token = localStorage.getItem("accessToken");

  const getCity = () => {
    fetch('https://autoapi.dezinfeksiyatashkent.uz/api/cities')
      .then((res) => res.json())
      .then((category) => {
        setCities(category.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const createForm = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('images', data.images);
    formData.append('text', data.text);
    fetch('https://autoapi.dezinfeksiyatashkent.uz/api/cities', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method: 'POST',
      body: formData,
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          getCity();
          handleModalClose();
          resetFormData();
          message.success("City added successfully");
        } else {
          message.error('Error adding city');
        }
      })
      .catch((error) => {
        console.error(error);
        message.error('Error adding city');
      });
  };

  useEffect(() => {
    getCity();
  }, []);

  const handleModalOpen = () => {
    setOpenModal(true);
  };

  const handleModalClose = () => {
    setOpenModal(false);
  };

  const handleEditModalOpen = (item) => {
    setId(item.id);
    setOpenEditModal(true);
    setData({ name: item.name, text: item.text, images: item.image_src });
  };

  const editCategory = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('text', data.text);
    formData.append('images', data.images);
    fetch(`https://autoapi.dezinfeksiyatashkent.uz/api/cities/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method: 'PUT',
      body: formData,
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          message.success('City updated successfully');
          getCity();
          handleEditModalClose();
        } else {
          message.error('Error updating city');
        }
      })
      .catch((err) => {
        console.error(err);
        message.error('Error updating city');
      });
  };

  const handleEditModalClose = () => {
    setOpenEditModal(false);
  };

  const handleDelete = (id) => {
    fetch(`https://autoapi.dezinfeksiyatashkent.uz/api/cities/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then(() => {
        getCity();
        hidePopover();
        message.success('City deleted successfully');
      })
      .catch((error) => {
        console.error(error);
        message.error('Error deleting city');
      });
  };

  const resetFormData = () => {
    setData({ name: '', text: '', images: null });
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Text',
      dataIndex: 'text',
      key: 'text',
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

  const dataSource = cities.map((city) => ({
    key: city.id,
    ...city,
  }));

  return (
    <div>
      <div className="flex justify-between mb-[20px]">
        <h2 className="text-3xl font-bold">Cities</h2>
        <button className="text-2xl text-white bg bg-[#1677ff] p-[7px_15px] rounded-[8px]" onClick={handleModalOpen}>Add City</button>
      </div>

      <div>
        <Table dataSource={dataSource} columns={columns} pagination={{ pageSize: 5 }} />
      </div>

      <Modal
        title="Add City"
        open={openModal}
        onCancel={handleModalClose}
        footer={null}
      >
        <form onSubmit={createForm}>
          <div className="mb-[20px]">
            <label className="block mb-[5px]">Name</label>
            <input
              type="text"
              value={data.name}
              onChange={(e) => setData({ ...data, name: e.target.value })}
              className="w-full p-[8px] border border-[#e5e7eb] rounded"
            />
          </div>
          <div className="mb-[20px]">
            <label className="block mb-[5px]">Text</label>
            <input
              type="text"
              value={data.text}
              onChange={(e) => setData({ ...data, text: e.target.value })}
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
              Add City
            </button>
          </div>
        </form>
      </Modal>

      {/* EDIT MODAL  */}

      <Modal
        title="Edit City"
        open={openEditModal}
        onCancel={handleEditModalClose}
        footer={null}
      >
        <form onSubmit={editCategory}>
          <div className="mb-[20px]">
            <label className="block mb-[5px]">Name</label>
            <input
              type="text"
              value={data.name}
              className="w-full p-[8px] border border-[#e5e7eb] rounded"
              onChange={(e) => setData({ ...data, name: e.target.value })}
            />
          </div>
          <div className="mb-[20px]">
            <label className="block mb-[5px]">Text</label>
            <input
              type="text"
              value={data.text}
              className="w-full p-[8px] border border-[#e5e7eb] rounded"
              onChange={(e) => setData({ ...data, text: e.target.value })}
            />
          </div>
          <div className="mb-[20px]">
            <label className="block mb-[5px]">Image</label>
            <input
              type="file"
              className="w-full p-[8px] border border-[#e5e7eb] rounded"
              onChange={handleImageChange}
            />
            {data.images && (
              <img className="w-[100px] mt-[15px]" src={`${urlImage}${data.images}`} alt="Selected Image" />
            )}
          </div>
          <div className="text-right">
            <button type="submit" className="text-white bg-[#1677ff] p-[10px_20px] rounded-[8px]">
              Edit City
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
}

export default Cities;
