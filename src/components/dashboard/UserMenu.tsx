import { useState } from 'react';
import { Menu, Dropdown, Modal } from 'antd';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import EditAccountModal from '../EditAccountModal';

type UserMenuProps = {
  children: React.ReactNode;
}

function UserMenu({ children }: UserMenuProps): JSX.Element {
  const history = useHistory();
  const [isModalVisible, setModalVisible] = useState(false);
  const [isMenuVisible, setMenuVisible] = useState(false);

  const closeAccountModal = () => setModalVisible(false);
  const openAccountModal = () => setModalVisible(true);

  const logout = () => {
    localStorage.clear();
    history.replace('/landing');
  };

  const openLogoutWarning = () => {
    setMenuVisible(true);

    Modal.confirm({
      content: 'Are you sure you want to log out?',
      cancelText: 'Cancel',
      okText: 'Log out',
      maskClosable: true,
      onOk: () => {
        // Need to wait a bit for the modal to close
        setTimeout(logout, 250);
      },
    });
  };

  const onMenuClick = () => setMenuVisible(false);

  const onMenuVisibleChange = (visible: boolean) => {
    setMenuVisible(visible);
  };

  const menu = (
    <Menu onClick={onMenuClick}>
      <Menu.Item onClick={openAccountModal}>Edit Account</Menu.Item>
      <Menu.Item onClick={openLogoutWarning}>Logout</Menu.Item>
    </Menu>
  );

  return (
    <>
      <Dropdown
        overlay={menu}
        visible={isMenuVisible}
        trigger={['click']}
        onVisibleChange={onMenuVisibleChange}
      >
        {children}
      </Dropdown>
      <EditAccountModal visible={isModalVisible} onClose={closeAccountModal} />
    </>
  );
}

UserMenu.propTypes = {
  children: PropTypes.node,
};

UserMenu.defaultProps = {
  children: null,
};

export default UserMenu;
