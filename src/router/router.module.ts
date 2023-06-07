import { DynamicModule, ForwardReference, Module, Type } from "@nestjs/common";
import { RouterModule as NestJsRouterModule } from "@nestjs/core";
import { AppController } from "src/app/controllers/app.controller";
import { RoutesAdminModule } from "./routes/routes.admin.module";

@Module({})
export class RouterModule {
  static forRoot(): DynamicModule {
    const imports: (DynamicModule | Type<any> | Promise<DynamicModule> | ForwardReference<any>)[] =
      [];

    if (process.env.HTTP_ENABLE === "true") {
      imports.push(
        NestJsRouterModule.register([
          {
            path: "/admin",
            module: RoutesAdminModule,
          },
        ]),
      );
    }

    return {
      module: RouterModule,
      providers: [],
      exports: [],
      controllers: [AppController],
      imports,
    };
  }
}
