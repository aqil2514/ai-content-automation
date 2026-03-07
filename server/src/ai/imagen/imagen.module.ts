import { Global, Module } from '@nestjs/common';
import { ImagenService } from './imagen.service';

@Global()
@Module({
  providers: [ImagenService],
  exports: [ImagenService],
})
export class ImagenModule {}