## 如何在 localhost 安裝與測試：

1. Clone the repo

2. Install dependencies

```bash
yarn install
```

3. Create a `.env.local` file in the root of the project and add a valid Postgres URL.

```bash

POSTGRES_URL=
NEXT_PUBLIC_BASE_URL=http://localhost:3001
AUTH_SECRET="Any string you want"

```

4.  Run the migrations

```bash
yarn migrate
```

5. Start the app

```bash
yarn dev
```
