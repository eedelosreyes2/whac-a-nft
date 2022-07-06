import { useMoralis } from 'react-moralis';
import Game from '../components/Game';
import Layout from '../components/Layout';

export default function Home() {
  const { isAuthenticated, authenticate, user, logout } = useMoralis();

  return (
    <Layout>
      <Game
        isAuthenticated={isAuthenticated}
        authenticate={authenticate}
        user={user}
        logout={logout}
      />
    </Layout>
  );
}
