import { Modal, Button, message, Table, Popover } from 'antd';
import React, { useEffect, useState } from 'react';

function Locations() {
  const [locations, setLocations] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openPopover, setOpenPopover] = useState(null);
  const [id, setId] = useState(null);
  const [data, setData] = useState({ name: '', slug: '', text: '', images: null });


  const urlImage = 'https://autoapi.dezinfeksiyatashkent.uz/api/uploads/images/';
  // const token = localStorage.getItem("accessToken")
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNTczNzkzNTUtZDNjYi00NzY1LTgwMGEtNDZhOTU1NWJiOWQyIiwidG9rZW5fdHlwZSI6ImFjY2VzcyIsImlhdCI6MTcxNzI1OTkxOSwiZXhwIjoxNzQ4Nzk1OTE5fQ.NZApBzV3gHG4vel-wbdHS29Z9eAp13w6ChrwjHJCwuM';

  const getLocations = () => {
    fetch('https://autoapi.dezinfeksiyatashkent.uz/api/locations')
      .then((res) => res.json())
      .then((location) => {
        setLocations(location.data);
        // localStorage.setItem("accessToken", data?.data?.tokens?.accessToken?.token);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  // CREATE FORM
  const createForm = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('slug', data.slug);
    formData.append('images', data.images);
    formData.append('text', data.text);
    fetch('https://autoapi.dezinfeksiyatashkent.uz/api/locations', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method: 'POST',
      body: formData,
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          getLocations();
          handleModalClose();
          message.success('Location added successfully');
        } else {
          message.error('Error adding location');
        }
      })
      .catch((error) => {
        console.error(error);
        message.error('Error adding location');
      });
  };

  // EDIT LOCATIONS

  const editLocations = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('slug', data.slug);
    formData.append('text', data.text);
    formData.append('images', data.images);
    fetch(`https://autoapi.dezinfeksiyatashkent.uz/api/locations/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method: 'PUT',
      body: formData,
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          message.success('Location updated successfully');
          getLocations();
          handleEditModalClose();
          resetFormData();
        } else {
          message.error('Error updating location');
        }
      })
      .catch((err) => {
        console.error(err);
        message.error('Error updating location');
      });
  };

  useEffect(() => {
    getLocations();
  }, []);

  const handleEditModalOpen = (item) => {
    setId(item.id);
    setOpenEditModal(true);
    setData({ name: item.name, slug: item.slug, text: item.text, images: item.image_src });
  };

  const handleEditModalClose = () => {
    setOpenEditModal(false);
    resetFormData();
  };

  // DELETE
  const handleDelete = (id) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this location?',
      onOk: () => {
        fetch(`https://autoapi.dezinfeksiyatashkent.uz/api/locations/${id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
          .then((res) => res.json())
          .then(() => {
            getLocations();
            hidePopover();
            message.success('Location deleted successfully');
          })
          .catch((error) => {
            console.error(error);
            message.error('Error deleting location');
          });
      },
    });
  };

  const handleModalOpen = () => {
    setOpenModal(true);
  };

  const handleModalClose = () => {
    setOpenModal(false);
    resetFormData();
  };

  const resetFormData = () => {
    setData({ name: '', slug: '', text: '', images: null });
  };

  const hidePopover = () => {
    setOpenPopover(null);
  };

  const handlePopoverOpenChange = (newOpen, id) => {
    setOpenPopover(newOpen ? id : null);
  };

  const handleImageChange = (e) => {
    setData({ ...data, images: e.target.files[0] });
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Slug',
      dataIndex: 'slug',
      key: 'slug',
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

  const dataSource = locations.map((location) => ({
    key: location.id,
    ...location,
  }));

  return (
    <div>
      <div className="flex justify-between mb-[20px]">
        <h2 className="text-3xl font-bold">Locations</h2>
        <Button className="rounded-md text-white bg bg-[#1677ff]" onClick={handleModalOpen}>
          Add a Location
        </Button>
      </div>

      <div>
        <Table dataSource={dataSource} columns={columns} pagination={{ pageSize: 5 }} />
      </div>

      <Modal
        title="Add Location"
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
            <label className="block mb-[5px]">Slug</label>
            <input
              type="text"
              value={data.slug}
              onChange={(e) => setData({ ...data, slug: e.target.value })}
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
              onChange={handleImageChange}
            />
          </div>
          <div className="text-right">
            <button type="submit" className="text-white bg bg-[#1677ff] p-[10px_20px] rounded-[8px]">
              Add Location
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        title="Edit Location"
        open={openEditModal}
        onCancel={handleEditModalClose}
        footer={null}
      >
        <form onSubmit={editLocations}>
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
            <label className="block mb-[5px]">Slug</label>
            <input
              type="text"
              value={data.slug}
              onChange={(e) => setData({ ...data, slug: e.target.value })}
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
              onChange={handleImageChange}
            />
          </div>
          <div className="text-right">
            <button type="submit" className="text-white bg bg-[#1677ff] p-[10px_20px] rounded-[8px]">
              Edit Location
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default Locations;