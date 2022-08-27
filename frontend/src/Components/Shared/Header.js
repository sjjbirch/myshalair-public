import banner from './Assests/banner.jpg';
import { Container } from '@mui/material';

const Header = () => {
  return (
    <>
      <Container
        id="header"
        className='header'
        sx={{
          display: 'flex',
          p: 0,
          justifyContent: 'center',
        }}>
        <img src={banner}
          alt="Banner"
          data-testid="header-img"
          style={{ maxWidth: '100%', maxHeight: '100%' }} />
      </Container>
    </>
  );
};

export default Header;