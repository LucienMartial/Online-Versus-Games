# Online Versus Games

## Local installation with Docker

### Prerequisites

- [Docker](https://docs.docker.com/install/)
- [Docker Compose](https://docs.docker.com/compose/install/)
- [Make](https://www.gnu.org/software/make/)

### Installation

1. Create the containers

This action should be done only at first installation or when the [Dockerfile](/app/Dockerfile) is modified.

```bash
make build
```

2. Run the containers

This action should be done every time you want to run the application.

```bash
make run
```

3. Build the node app

    1. Enter the node container

    ```bash
        make connect
    ```

    2. Install the dependencies

    This action should be done only at first installation or when the [package.json](/app/package.json) is modified.

    ```bash
        npm run setup
    ```

    3. Build the app

    ```bash
        npm run build
    ```

## Usage

### Use the app

1. Make sure the containers are running

```bash
make run
```

2. Run the server

```bash
make connect
npm start
```

3. Open the app

Open your browser and go to [http://localhost:3000](http://localhost:3000)

### See the database

Open your browser and go to [http://localhost:8081](http://localhost:8081)

### Stop the app

Close the containers

```bash
make stop
```
