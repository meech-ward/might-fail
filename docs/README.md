## Might Fail Docs

### Blocks

#### YouTube

```mdx
<YouTube videoId="PbkwqVZsUgs" startTime={230} />
```

#### Example Block

```mdx
<SideBySide ratio="3:5">
<ExampleCard>
Return a single root element, div or empty tag `<>`
</ExampleCard>
  \`\`\`some-component.jsx
    // focus(1:2) 
  return (
    <div>
      <h1 className="header">Hello</h1>
      <h2>World</h2>
      <img className="image" src="https://picsum.photos/200" alt="random"></img>
    </div>
  )
  \`\`\`
</SideBySide>
```

#### Instruction Block 

```mdx
<Instruction>
  <Instruction.Action step={1}>
    Add this code to your thing:
  </Instruction.Action>
  <Instruction.Implementation>

  ```App.js
  return (
      <div className="App">
        <h1 className="heading">Hello</h1>
        <h2>World</h2>
        <h3>{new Date().toString()}</h3>
      </div>
  )
  ```
  </Instruction.Implementation>
</Instruction>
```

```mdx
<Instruction ratio="">
type Ratio = "1" | "1:1" | "2:3" | "3:2" | "3:5" | "5:3" | "4:7" | "1:2" | "1:0" | "0:1"
```

#### Tabs 

```
<Tabs>
  <Tab name="npx">
    ```sh
    npx create-next-app@latest
    ```
  </Tab>
  <Tab name="yarn">
    ```sh
    yarn create next-app
    ```
  </Tab>
  <Tab name="pnpm">
    ```sh
    pnpm create next-app
    ```
  </Tab>
  <Tab name="bunx">
    ```sh
    bunx create-next-app
    ```
  </Tab>
</Tabs>
```

## Card 

```
<Card>
</Card>
```

## File Tree 

```mdx
<Card>
<FileTree focus={[{depth: number, item: number}]}>
  - src 
   - app
    - page.tsx
</FileTree>
</Card>
```

```mdx 
<Instruction ratio="1:1">
  <Instruction.Action  step={1}>
    Create a new file inside of `create-post` called `page.tsx`.
  </Instruction.Action>
  <Instruction.Implementation>
    <Card>
      <FileTree focus={[{depth: 4, item: 1}]}>
      - src
        - app 
          - page.tsx 
          - create-post (`/create-post` route)
            - page.tsx (UI)
      </FileTree>
    </Card>
  </Instruction.Implementation>
</Instruction>
```

## Code

```mdx
<CodeWithOutput>
  ```users.ts
  import { pgTable, text, varchar, timestamp } from "drizzle-orm/pg-core"

  export const users = pgTable("users", {
    id: text("id").primaryKey(),
    username: varchar("username", { length: 30 }).notNull(),
    firstName: varchar("first_name", { length: 50 }).notNull(),
    lastName: varchar("last_name", { length: 50 }).notNull(),
    avatar: text("avatar").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  })
  ```
  ```sql
  CREATE TABLE IF NOT EXISTS "users" (
    "id" text PRIMARY KEY NOT NULL,
    "username" varchar(30) NOT NULL,
    "first_name" varchar(50) NOT NULL,
    "last_name" varchar(50) NOT NULL,
    "avatar" text NOT NULL,
    "created_at" timestamp with time zone DEFAULT now() NOT NULL
  );
  ```
</CodeWithOutput>
```


```mdx
<CodeTabs>
  ```/home/ubuntu/index.html
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>Hello World</title>
  </head>
  <body>
    <h1>Hello World</h1>
    <p>🌎</p>
  </body>
  </html>
  ```
  ```/home/ubuntu/404.html
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>404 - Page Not Found</title>
  </head>
  <body>
    <h1>404 - Page not found</h1>
    <p>🤷‍♀️</p>
  </body>
  </html>
  ```
</CodeTabs>
```

**Not yet fully working:**
```mdx
<CodeSideBySide>
  ```users.ts
  // toolbar sql
  import { text, varchar, pgTable, timestamp } from "drizzle-orm/pg-core"

  export const users = pgTable("users", {
    id: text("id").primaryKey(),
    username: varchar("username", { length: 30 }).notNull(),
    firstName: varchar("first_name", { length: 50 }).notNull(),
    lastName: varchar("last_name", { length: 50 }).notNull(),
    avatar: text("avatar").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  })
  ```
  ```schema.sql
  -- toolbar sql
  CREATE TABLE IF NOT EXISTS "users" (
    "id" text PRIMARY KEY NOT NULL,
    "username" varchar(30) NOT NULL,
    "first_name" varchar(50) NOT NULL,
    "last_name" varchar(50) NOT NULL,
    "avatar" text NOT NULL,
    "created_at" timestamp with time zone DEFAULT now() NOT NULL
  );
  ```
</CodeSideBySide>
```

## Image

The image path needs to be aboslute to where it is in the markdown system.
append dark or light to the end of the image path to switch between the two.

```md
![Create Project](/part-2/10-setup-neon-images/project-creation-dark.png) ![Create Project](/part-2/10-setup-neon-images/project-creation-light.png)
```