import {Button, Col, Form, Input, Modal, Row, Table} from 'antd';
import {useEffect, useState} from 'react';
import {getUserList} from '@/components/content/ContentManager';
import styles from '../../styles/list.module.scss';
import {DeleteOutlined, EditOutlined} from '@ant-design/icons';
import UserManagementModal from '@/components/forms/UserManagementModal';

const UserList = () => {
  const [userModal, setUserModal] = useState(false);
  const [userDetails, setUserDetails] = useState({});

  const dataSource = [
    {
      key: '1',
      name: 'Mike',
      age: 32,
      address: '10 Downing Street',
    },
    {
      key: '2',
      name: 'John',
      age: 42,
      address: '10 Downing Street',
    },
  ];

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Age',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Aksiyon',
      dataIndex: 'address',
      key: 'action',
      width: '65px',
      render: (item) => <div className={styles['tableActions']}>
        <DeleteOutlined className={styles['deleteButton']} onClick={() => console.log(item)}/>
        <EditOutlined className={styles['editButton']} onClick={() => console.log(item)}/>
      </div>
    },
  ];

  useEffect(() => {
    getUserList().then(response => {
      console.log(response)
    })
  }, [])

  return <Row gutter={[16, 16]}>
    <Col span={24}>
      <Button type='primary' onClick={() => setUserModal(true)}>Kullanıcı Ekle</Button>
    </Col>
    <Col span={24}>
      <Table dataSource={dataSource} columns={columns} />
    </Col>
    <Modal
      destroyOnClose={true}
      width={600}
      title={Object.values(userDetails).every(x => x === null || x === '') ? 'Kullanıcı Oluştur' : 'Kullanıcıyı Düzenle'}
      open={userModal}
      onCancel={() => setUserModal(false)}
      footer={false}>
      <UserManagementModal userDetails={userDetails}/>
    </Modal>
  </Row>;
}

export default UserList;