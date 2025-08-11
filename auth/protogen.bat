@echo off

set PROTOC_GEN_TS_PROTO=.\node_modules\.bin\protoc-gen-ts_proto.cmd
set PROTO_DIR=.\src\infrastructure\rpc\gRPC\protos
set OUT_DIR=.\src\infrastructure\rpc\gRPC\generated

if not exist "%OUT_DIR%" mkdir "%OUT_DIR%"

protoc ^
  --plugin=protoc-gen-ts_proto="%PROTOC_GEN_TS_PROTO%" ^
  --ts_proto_out="%OUT_DIR%" ^
  --ts_proto_opt=outputServices=grpc-js,esModuleInterop=true ^
  -I "%PROTO_DIR%" ^
  -I ./node_modules ^
  "%PROTO_DIR%\*.proto"


echo Proto files compiled successfully to %OUT_DIR%