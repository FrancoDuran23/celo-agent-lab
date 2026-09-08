#!/usr/bin/env node
/** The committee over stdio, for a local agent. Same tools as the HTTP entry. */

import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { buildServer } from './mcp-tools.js'

await buildServer().connect(new StdioServerTransport())
