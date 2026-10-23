import { Redirect } from 'expo-router';

import { homeFor, useSession } from '../store/Session';

export default function Index() {
  const { status, me } = useSession();
  return <Redirect href={status === 'signedIn' ? homeFor(me) : '/welcome'} />;
}
