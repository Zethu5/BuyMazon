import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cmsPipe'
})
export class CmsPipePipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
