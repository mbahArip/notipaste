import PocketBase from 'pocketbase';
import { TypedPocketBase } from 'typed-pocketbase';

import { Schema } from 'types/Database';

const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL) as TypedPocketBase<Schema>;
pb.autoCancellation(false);

export default pb;
