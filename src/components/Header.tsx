'use client';
import styled from 'styled-components';
import { FaSearch } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { logoutUser } from '@/store/auth/auth-thunk';
import { useRouter } from 'next/navigation';
import GlobalTaskLoadingOverlay from './GlobalTaskLoadingOverlay';

const HeaderContainer = styled.header`
  width: 100%;
  height: 70px; /* No se alteran medidas */
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
`;

const SearchButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: #e5e5e5;
  }

  svg {
    color: #333;
    font-size: 16px;
  }
`;

const UserCard = styled.div`
  display: flex;
  align-items: center;
  background: #fff;
  padding: 6px 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  min-width: 250px;
  height: 50px;
`;

const UserImage = styled.img`
  width: 38px;
  height: 38px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 10px;
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: 10px;
  line-height: 1.1;
`;

const UserName = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: #333;
`;

const UserEmail = styled.span`
  font-size: 12px;
  color: #777;
`;

const Divider = styled.div`
  width: 1px;
  height: 30px;
  background: #ddd;
  margin: 0 10px;
`;

const LogoutButton = styled.button`
  background: #fff;
  border: 1px solid #ddd;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  color: #333;
  transition: background 0.2s ease;

  &:hover {
    background: #f5f5f5;
  }
`;

export default function Header() {

  const { user } = useSelector((state: RootState) => state.auth);

  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const { loading, error } = useSelector((state: RootState) => state.auth);

  const handleLogout = async () => {
    const result = await dispatch(logoutUser());

    if (logoutUser.fulfilled.match(result)) {
      router.push('/login');
    } else {
      alert(result.payload || 'Error al cerrar sesión');
    }
  };

  return (
    <>
    <GlobalTaskLoadingOverlay />     
    <HeaderContainer>
      <SearchButton>
        <FaSearch />
      </SearchButton>
      <UserCard>
        <UserImage src={user.photo} alt={user.name} />
        <UserInfo>
          <UserName>{user.name}</UserName>
          <UserEmail>{user.email}</UserEmail>
        </UserInfo>
        <Divider />
        <LogoutButton onClick={handleLogout}>Cerrar sesión</LogoutButton>
      </UserCard>
    </HeaderContainer>
    </>
  );
}
