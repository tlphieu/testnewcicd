# Jenkins lab cho User Management API

Từ thư mục gốc repository, chạy:

```bash
python3 jenkins/run-lab.py
```

Mở http://localhost:8080, username `labadmin`. Mật khẩu nằm trong
`jenkins/.admin-password` (đã được ignore, không commit).

Chọn `user-api-local` → **Build Now** → số build → **Console Output**.
Pipeline chạy source local đã sao chép tại thời điểm chạy script. Sau khi sửa
source, chạy lại script để đồng bộ trước khi build lại.

Runtime: `~/.local/share/user-api-jenkins-lab`; dữ liệu Jenkins nằm trong named
volume `user-api-jenkins_jenkins_home`. Không dùng `down -v` nếu muốn giữ dữ liệu.

Dừng:

```bash
docker compose -p user-api-jenkins \
  -f "$HOME/.local/share/user-api-jenkins-lab/jenkins/compose.yaml" stop
```

Job local chưa push GitHub và chưa deploy production. Audit high/critical sẽ làm
build thất bại: xem log và sửa dependency trước khi triển khai. Hướng dẫn đầy đủ
và Jenkinsfile mẫu kết nối GitHub/Render: `latex/huong-dan-jenkins.tex`.

Lab dùng một executor trên controller; môi trường dùng chung cần agents riêng.
Không chạy source không tin cậy với credentials production. Khi sửa
`Jenkinsfile.local`, cập nhật Pipeline script của job đã tạo; init script chỉ
tạo job một lần.
