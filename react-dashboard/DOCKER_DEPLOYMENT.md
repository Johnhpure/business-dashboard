# Docker 部署指南

本文档提供了如何使用 Docker 构建和部署 React Dashboard 应用的详细说明。

## 前提条件

- 安装 [Docker](https://docs.docker.com/get-docker/)
- 安装 [Docker Compose](https://docs.docker.com/compose/install/)（可选，用于本地测试）
- 确保服务器是 x86 架构

## 构建 Docker 镜像

### 方法 1：使用 Docker 命令

在项目根目录下执行以下命令：

```bash
# 构建镜像
docker build -t react-dashboard:latest .

# 查看构建的镜像
docker images
```

### 方法 2：使用 Docker Compose

在项目根目录下执行以下命令：

```bash
# 构建镜像
docker-compose build

# 查看构建的镜像
docker images
```

## 运行 Docker 容器

### 方法 1：使用 Docker 命令

```bash
# 运行容器
docker run -d -p 80:80 --name react-dashboard react-dashboard:latest

# 查看运行中的容器
docker ps

# 查看容器日志
docker logs react-dashboard
```

### 方法 2：使用 Docker Compose

```bash
# 启动服务
docker-compose up -d

# 查看运行中的容器
docker-compose ps

# 查看容器日志
docker-compose logs -f
```

## 停止和删除容器

### 方法 1：使用 Docker 命令

```bash
# 停止容器
docker stop react-dashboard

# 删除容器
docker rm react-dashboard
```

### 方法 2：使用 Docker Compose

```bash
# 停止服务
docker-compose down
```

## 推送到 Docker Registry（可选）

如果需要将镜像推送到私有或公共 Docker Registry：

```bash
# 登录到 Docker Registry
docker login [registry-url]

# 给镜像添加标签
docker tag react-dashboard:latest [registry-url]/react-dashboard:latest

# 推送镜像
docker push [registry-url]/react-dashboard:latest
```

## 服务器部署

在服务器上部署应用：

1. 确保服务器已安装 Docker
2. 将构建好的镜像传输到服务器，或从 Docker Registry 拉取
3. 运行容器：

```bash
docker run -d -p 80:80 --restart unless-stopped --name react-dashboard react-dashboard:latest
```

## 配置 HTTPS（推荐）

对于生产环境，建议配置 HTTPS。可以使用 Nginx 反向代理或直接修改容器内的 Nginx 配置。

### 使用外部 Nginx 反向代理

1. 在服务器上安装 Nginx
2. 配置 SSL 证书
3. 设置反向代理指向 Docker 容器

## 常见问题排查

### 容器无法启动

检查日志：

```bash
docker logs react-dashboard
```

### 应用无法访问

1. 确认容器正在运行：`docker ps`
2. 检查端口映射：`docker port react-dashboard`
3. 检查服务器防火墙设置

### 页面加载但路由不工作

确认 Nginx 配置正确处理了前端路由。检查 `nginx.conf` 中的 `try_files` 指令。

## 性能优化

- 考虑使用 CDN 分发静态资源
- 配置适当的缓存策略
- 监控容器资源使用情况：`docker stats react-dashboard`

## 安全建议

- 定期更新基础镜像
- 使用非 root 用户运行容器
- 限制容器资源使用
- 实施网络安全策略
- 定期扫描镜像漏洞
