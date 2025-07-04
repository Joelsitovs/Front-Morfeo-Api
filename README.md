# Morfeo3d

<a alt="Nx logo" href="https://nx.dev" target="_blank" rel="noreferrer"><img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-logo.png" width="45"></a>

✨ Your new, shiny [Nx workspace](https://nx.dev) is ready ✨.

[Learn more about this workspace setup and its capabilities](https://nx.dev/getting-started/tutorials/angular-standalone-tutorial?utm_source=nx_project&amp;utm_medium=readme&amp;utm_campaign=nx_projects) or run `npx nx graph` to visually explore what was created. Now, let's get you up to speed!

## Run tasks

To run the dev server for your app, use:

```sh
npx nx serve morfeo3d
```

To create a production bundle:

```sh
npx nx build morfeo3d
```

To see all available targets to run for a project, run:

```sh
npx nx show project morfeo3d
```

These targets are either [inferred automatically](https://nx.dev/concepts/inferred-tasks?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) or defined in the `project.json` or `package.json` files.

[More about running tasks in the docs &raquo;](https://nx.dev/features/run-tasks?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## Add new projects

While you could add new projects to your workspace manually, you might want to leverage [Nx plugins](https://nx.dev/concepts/nx-plugins?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) and their [code generation](https://nx.dev/features/generate-code?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) feature.

Use the plugin's generator to create new projects.

To generate a new application, use:

```sh
npx nx g @nx/angular:app demo
```

To generate a new library, use:

```sh
npx nx g @nx/angular:lib mylib
```

You can use `npx nx list` to get a list of installed plugins. Then, run `npx nx list <plugin-name>` to learn about more specific capabilities of a particular plugin. Alternatively, [install Nx Console](https://nx.dev/getting-started/editor-setup?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) to browse plugins and generators in your IDE.

[Learn more about Nx plugins &raquo;](https://nx.dev/concepts/nx-plugins?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) | [Browse the plugin registry &raquo;](https://nx.dev/plugin-registry?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## Set up CI!

### Step 1

To connect to Nx Cloud, run the following command:

```sh
npx nx connect
```

Connecting to Nx Cloud ensures a [fast and scalable CI](https://nx.dev/ci/intro/why-nx-cloud?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) pipeline. It includes features such as:

- [Remote caching](https://nx.dev/ci/features/remote-cache?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [Task distribution across multiple machines](https://nx.dev/ci/features/distribute-task-execution?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [Automated e2e test splitting](https://nx.dev/ci/features/split-e2e-tasks?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [Task flakiness detection and rerunning](https://nx.dev/ci/features/flaky-tasks?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

### Step 2

Use the following command to configure a CI workflow for your workspace:

```sh
npx nx g ci-workflow
```

[Learn more about Nx on CI](https://nx.dev/ci/intro/ci-with-nx#ready-get-started-with-your-provider?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## Install Nx Console

Nx Console is an editor extension that enriches your developer experience. It lets you run tasks, generate code, and improves code autocompletion in your IDE. It is available for VSCode and IntelliJ.

[Install Nx Console &raquo;](https://nx.dev/getting-started/editor-setup?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## Documentación de Rutas en Morfeo3D

### Rutas principales (`appRoutes`)

| Ruta         | Acción                                   | Guardas               | Descripción                             |
|--------------|-----------------------------------------|-----------------------|---------------------------------------|
| `/`          | Carga módulo `LayoutsModule`             | Ninguno               | Rutas públicas y frontend general     |
| `/dashboard` | Carga módulo `LayoutsDashModule`         | `authGuard`           | Panel de usuario autenticado           |
| `/login`     | Carga componente `LoginComponent`        | `NoLoginGuard`        | Página de login para usuarios no logueados |
| `/register`  | Carga componente `RegisterComponent`     | Ninguno               | Registro público                       |
| `**`         | Carga componente `NotFoundComponent`     | Ninguno               | Página 404 para rutas no definidas    |

---

### Módulo Dashboard (`LayoutsDashRoutingModule`)

| Ruta                     | Componente               | Guardas         | Descripción                         |
|--------------------------|--------------------------|-----------------|-----------------------------------|
| `/panel`                 | `DashboardComponent`     | `RoleGuard`     | Panel administrativo               |
| `/pedidos`               | `PedidosComponent`       | Ninguno         | Gestión de pedidos                 |
| `/usuarios`              | `UserComponent`          | `RoleGuard`     | Listado de usuarios               |
| `/usuarios/:id/editar`   | `UserEditComponent`      | `RoleGuard`     | Edición de usuario por ID         |

---

### Módulo Layouts Público (`LayoutsRoutingModule`)

| Ruta                 | Componente                   | Descripción                       |
|----------------------|------------------------------|---------------------------------|
| `/`                  | `HomeComponent`               | Página principal                 |
| `/success`            | `SucessComponent`             | Página de éxito                  |
| `/materiales`         | `MaterialsComponent`          | Listado de materiales            |
| `/materiales/:slug`   | `MaterialIdComponent`         | Detalle de material dinámico     |
| `/vista-previa`       | `VistaPreviaComponent`        | Vista previa                    |
| `/vision`             | `VisionComponent`             | Página visión                   |

---

### Guardas (Guards)

- `authGuard`: Protege rutas para usuarios autenticados.
- `NoLoginGuard`: Bloquea el acceso a login para usuarios ya autenticados.
- `RoleGuard`: Controla acceso según roles específicos (e.g. admin).

---

### Características de las rutas

- **Carga perezosa** con `loadChildren` y `loadComponent` para optimizar el rendimiento.
- **Protección de rutas** con guardas para mantener seguridad y control de acceso.
- **Ruta comodín `**`** para manejar páginas no encontradas (404) con componente personalizado.

---

### Resumen visual

