import { ApiBody } from "@nestjs/swagger"

export const UploadFile = (filename:string = 'file'): MethodDecorator => (
    target: any, 
    propertyKey, 
    descriptor: PropertyDescriptor
) => {
    ApiBody({
        schema: {
            type: 'object',
            properties: {
                [filename]: {
                    type: 'string',
                    format: "binary"
                }
            }
        }
    })(target, propertyKey, descriptor)
}

export const UploadFiles = (filename:string = 'file'): MethodDecorator => (
    target: any, 
    propertyKey, 
    descriptor: PropertyDescriptor
) => {
    ApiBody({
        schema: {
            type: 'object',
            properties: {
                [filename]: {
                    type: 'array',
                    items: {
                        type: 'string',
                        format: 'binary'
                    }
                }
            }
        }
    })(target, propertyKey, descriptor)
}
