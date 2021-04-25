import { DynamoDB } from 'aws-sdk';
import DocumentModel from '@models/document.model';

type PutOutput = DynamoDB.DocumentClient.PutItemOutput;
type UpdateOutput = DynamoDB.DocumentClient.UpdateItemOutput;

/*global DatabaseService */
class DBService implements DatabaseService {
  private documentClient: DynamoDB.DocumentClient;
  private table: string;

  constructor(table: string) {
    this.documentClient = new DynamoDB.DocumentClient();
    this.table = table;
  }

  async getAll<I>(params: Record<string, unknown>): Promise<I[]> {
    const {
      expression: FilterExpression,
      ExpressionAttributeValues
    } = this.computeUpdateExpressionAndAttributes(params, false);

    const doc = await this.documentClient
      .scan({
        TableName: this.table,
        FilterExpression,
        ExpressionAttributeValues
      })
      .promise();

    return doc.Items as I[];
  }

  async getById<I>(id: string): Promise<I> {
    const doc = await this.documentClient
      .get({
        TableName: this.table,
        Key: { id }
      })
      .promise();
    return doc.Item as I;
  }

  async create<I>(fields: Record<string, unknown>): Promise<I> {
    const item = DocumentModel.create<I>(fields);
    const doc: PutOutput = await this.documentClient
      .put({
        TableName: this.table,
        Item: item,
        ReturnValues: 'ALL_OLD'
      })
      .promise();
    return Object.keys(doc).length ? (doc as I) : item;
  }

  async updateById<I>(id: string, fields: Record<string, unknown>): Promise<I> {
    const {
      expression: UpdateExpression,
      ExpressionAttributeValues
    } = this.computeUpdateExpressionAndAttributes(fields);

    const updateParams = {
      TableName: this.table,
      Key: {
        id
      },
      UpdateExpression,
      ExpressionAttributeValues,
      ReturnValues: 'ALL_NEW'
    };

    const doc: UpdateOutput = await this.documentClient
      .update(updateParams)
      .promise();
    return doc.Attributes as I;
  }

  deleteById(id: string): void {
    console.log(id);
  }

  private computeUpdateExpressionAndAttributes(
    fields: Record<string, unknown>,
    set = true
  ): {
    expression: string;
    ExpressionAttributeValues: Record<string, unknown>;
  } {
    let expression = set ? 'set ' : '';
    const ExpressionAttributeValues: Record<string, unknown> = {};

    let i = 0;
    let key: string;
    for (key in fields) {
      expression += `${key} = :${key}${
        Object.keys(fields).length !== ++i ? ',' : ''
      }`;
      ExpressionAttributeValues[`:${key}`] = fields[key];
    }

    return { expression, ExpressionAttributeValues };
  }
}

export default DBService;
