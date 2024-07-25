# Use the official .NET runtime as a parent image
FROM mcr.microsoft.com/dotnet/aspnet:7.0 AS base
WORKDIR /app
EXPOSE 80

# Use the SDK image to build the application
FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
WORKDIR /src
COPY ["PRMS_System.csproj", "./"]
RUN dotnet restore "./PRMS_System.csproj"
COPY . .
WORKDIR "/src"
RUN dotnet build "PRMS_System.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "PRMS_System.csproj" -c Release -o /app/publish

# Use the runtime image to run the application
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "PRMS_System.dll"]
