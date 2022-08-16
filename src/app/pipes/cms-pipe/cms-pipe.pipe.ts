import { Pipe, PipeTransform } from '@angular/core';
import { lastValueFrom, map, of } from 'rxjs';
import { CMSService } from 'src/app/services/cms/cms.service';

@Pipe({
  name: 'cmsPipe'
})
export class CmsPipePipe implements PipeTransform {

  constructor(private cmsService: CMSService) {}

  async transform(id: string, ...args: unknown[]) {
    return await lastValueFrom(this.cmsService.getUpperBoundforProdCode(id))
  }

}
