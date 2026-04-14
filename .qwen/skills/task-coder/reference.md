# Referências Rápidas — Task Coder

## Estrutura de Pastas Válida

```
app/
├── controllers/     # CamelCase: DemandasController.ts
├── services/        # CamelCase: DemandaService.ts
├── models/          # CamelCase: Demanda.ts
├── validators/      # CamelCase: DemandaValidator.ts
├── adapters/        # CamelCase: DemandaAdapter.ts
├── dtos/            # CamelCase: DemandaDto.ts
├── events/          # CamelCase: DemandaPublicada.ts
├── listeners/       # CamelCase: EnviarEmailListener.ts
├── jobs/            # CamelCase: CleanupJob.ts
├── middleware/      # CamelCase: AuthMiddleware.ts
└── exceptions/      # CamelCase: DemandaNaoEncontradaException.ts
```

## Edge Templates — Padrões Críticos

### Página (ex: login.edge)
```edge
@layout()
  <h1>Login</h1>
  <form action="{{ route('login.store') }}" method="POST">
    {{ csrfField() }}
    <input name="email" type="email" />
    <button type="submit">Entrar</button>
  </form>
@end
```

### Layout (components/layout.edge)
```edge
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="csrf-token" content="{{ csrfToken }}">
  <title>{{ title ?? 'Muvia' }}</title>
  @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body>
  <nav>
    @if(auth.user)
      Olá, {{ auth.user.fullName ?? auth.user.email.split('@')[0] }}
    @else
      <a href="{{ route('login') }}">Entrar</a>
    @end
  </nav>
  <main>{{{ await $slots.main() }}}</main>
</body>
</html>
```

## Rotas — Padrão

```ts
router.get('/login', [SessionController, 'create']).as('login')
router.post('/login', [SessionController, 'store']).as('login.store')
router.post('/logout', [SessionController, 'destroy']).as('logout')
```

## Controller — Padrão

```typescript
import { DemandaService } from '#services/demanda-service'
import { CreateDemandaDto } from '#dtos/create-demanda-dto'
import type { HttpContext } from '@adonisjs/core/http'

export class DemandasController {
  async store({ request, response }: HttpContext) {
    const dto = CreateDemandaDto.fromRequest(request)
    const demanda = await DemandaService.create(dto)
    return response.json(demanda)
  }
}
```

## Service — Padrão

```typescript
import { Demanda } from '#models/demanda'
import { CreateDemandaDto } from '#dtos/create-demanda-dto'
import logger from '@adonisjs/core/services/logger'

export class DemandaService {
  static async create(dto: CreateDemandaDto): Promise<Demanda> {
    logger.info('DemandaService.create - Criando nova demanda')
    const demanda = await Demanda.create(dto.toJSON())
    return demanda
  }
}
```

## Logging — Padrão

```typescript
// Correto
logger.info('UserService.create - Usuário criado com sucesso')
logger.error('AuthService.login - Falha na autenticação: ' + error.message)
logger.warn('KycService.verify - Documento expirando em 5 dias')
logger.debug('DemandaService.list - Query: ' + query)

// Errado (NUNCA FAZER)
logger.info('criou usuário')
logger.error(error)
logger.info(JSON.stringify(request.all())) // Logar dados sensíveis
```
