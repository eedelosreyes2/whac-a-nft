import Game from '../components/Game';
import Layout from '../components/Layout';

export default function Home() {
  return (
    <Layout>
      <Game />
      <h1 className="text-3xl font-bold underline">Hello world!</h1>
    </Layout>
  );
}
