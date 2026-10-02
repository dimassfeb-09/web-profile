# sv

Everything you need to build a Svelte project, powered by [`sv`](https://github.com/sveltejs/cli).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```sh
# create a new project
npx sv create my-app
```

To recreate this project with the same configuration:

```sh
# recreate this project
bun x sv@0.17.0 create --template minimal --types ts --install bun /Users/dimassfeb/Project/web-profile-sveltekit
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```sh
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```sh
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.

## MCP endpoint (`/mcp`)

An MCP server exposing the profile content as CRUD tools, so an assistant can read and
edit it. Four tools: `get_content`, `create_content`, `update_content`, `delete_content`,
covering the `home`, `about`, `contact`, `projects`, `achievements`, `educations`,
`experience`, `skills`, `certificates` and `blog` domains. The tool descriptions carry the
per-domain field list, derived from the same zod schemas the admin API uses.

The transport is stateless Streamable HTTP (`sessionIdGenerator: undefined`) because
Vercel freezes each function after the response, so nothing survives between requests.

### Setup

1. Run `db/mcp_api_keys.sql` once in the Supabase SQL editor (and in your local dev database).
2. Open **Admin → MCP Keys** and create a key. The raw key is shown once; only its SHA-256
   hash is stored.

`bun run mcp:key` was removed on purpose: the admin page is the single privileged path for
minting and revoking, so there is no second one to keep in sync.

`wp_` prefixes bind a key to an environment - production only accepts `wp_live_` keys, so a
dev key is never a prod backdoor.

### One key per trust level, not per agent

Do not mint a key per client. That just moves the revocation problem: a leak means finding
and revoking twelve keys. Instead:

| Key | Scope | Shared by |
|---|---|---|
| `research` | `read` | every agent that only looks things up |
| `publish` | `read_write` | whichever agent writes content |

Name each key after its client or trust level, not the machine - that is what makes
"last used" tell you something. `last_used_at` is the leak detector: an unfamiliar timestamp
means revoke that prefix.

### Client config

```json
{
  "mcpServers": {
    "web-profile": {
      "url": "https://www.dimassfeb.com/mcp",
      "headers": { "Authorization": "Bearer wp_live_..." }
    }
  }
}
```

### Notes

- `blog.content` must be Tiptap `JSONContent`, so writing rich text through an assistant is
  the rough edge here. The other nine domains take plain fields.
- `about`, `contact` and `blog` have no zod schema in the admin API, so MCP does not add
  one either; pass the fields the service expects.
