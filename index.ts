import app from './src/app'
import dotenv from 'dotenv'
import chalk from 'chalk'

dotenv.config()

const { HTTP_SERVER_PORT = 3000 } = process.env

try {
    app.listen(Number(HTTP_SERVER_PORT), () => {
        console.log(chalk.magenta(`API up and running on port: ${HTTP_SERVER_PORT}`))
    })
} catch (error) {
    console.log(error)
}
