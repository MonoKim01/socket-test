# Socket-test

## 소개

`Socket-test`는 krampoline의 가장 기본적인 예제 중 하나입니다. 
이 저장소에서는 `node`를 사용하여 3000번 포트에서 서버를 열고 프론트엔드와의 소켓 연결, 파일 업로드, 데이터 베이스 연결 및 데이터 불러오기를 담고 있습니다.
구성요소들에 대한 기본적인 설명입니다.

1. Deployment
  - 목적: 애플리케이션의 레플리카(복제본)를 관리하고 업데이트하는 방식을 정의.
    - 기능:
      - 애플리케이션의 레플리카 수를 지정하고 유지.
      - 롤링 업데이트를 사용하여 애플리케이션의 새 버전을 점진적으로 배포.
      - 애플리케이션의 상태를 모니터링하고, 필요한 경우 레플리카를 재시작.
2. Service
  - 목적: 네트워크 경로를 사용하여 일련의 파드에 액세스하는 방법을 정의.
    - 기능:
      - 파드의 집합에 대한 로드 밸런싱 제공.
      - 하나의 IP와 포트를 사용하여 파드 집합에 액세스.
      - 서비스 발견을 위한 내부 DNS 이름 제공.
3. Ingress
  - 목적: HTTP 및 HTTPS 트래픽을 클러스터 서비스로 라우팅하는 방법을 정의.
    - 기능:
      - URL 경로 기반의 트래픽 라우팅. ( krampoline의 경우 매우 중요함. )
      - 호스트 기반 트래픽 라우팅.
      - SSL/TLS 종료 및 리다이렉트.
4. ConfigMap
  - 목적: 애플리케이션 구성 및 설정 데이터를 파드와 분리하여 관리하는 방법을 제공.
    - 기능:
      - 환경 변수, 커맨드-라인 인수 또는 설정 파일로 사용되는 키-값 쌍을 저장.
      - 애플리케이션 구성을 파드와 분리하여 관리, 이로 인해 재배포 없이 구성 변경 가능.
      - 다양한 파드 또는 컨테이너에 재사용 가능한 구성 정보 제공.
5. StatefulSet
  - 목적: 상태를 유지하는 애플리케이션을 위한 파드 관리, 특히 순서와 신원을 유지하는데 중요.
    - 기능:
      - 각 파드의 고유한 신원(예: 순서적인 이름, 고유 네트워크 식별자)을 보장.
      - 순서대로 파드를 배포 및 스케일링 (예: 하나씩 순차적으로).
      - 지속적인 스토리지(Volume)를 파드와 연결하여, 파드가 재스케줄되어도 데이터 유지.


## 수정이 필요한 파일

### k8s/deployment.yaml
```yaml
...
  template:
    metadata:
      labels:
        app: krampoline
    spec:
      containers:
        - name: krampoline
          # 여러분의 image 주소를 입력해주세요.
          # 해당 image 주소는 IDE 에서 d2hub 기능을 이용해서 생성하실 수 있습니다.
          # 다음은 예시입니다.
          image: krmp-d2hub-idock.9rum.cc/dev-test/repo_3cdea8ed6566

```

### k8s/ingress.yaml
```yaml
...
spec:
  rules:
    - http:
        paths:
          - backend:
              serviceName: krampoline
              servicePort: 3000
            # 여러분의 app path 를 넣어주세요.
            # 해당 app path 주소는 IDE 에서 kargo 기능을 이용해서 생성하실 수 있습니다.
            # 다음은 예시입니다.
            path: /

```

### k8s/configs/init.sql
데이터 베이스가 시작될 때 사용될 부분입니다.


## 기본적인 명령어
자주 질문 주시는 명령어 입니다. 더 다양한 명령어는 [Kubectl Cheat Sheet](https://kubernetes.io/docs/reference/kubectl/cheatsheet/)을 참고해주세요.

### log 보는 법
1. `kubectl get pods`를 이용해서 pod의 이름을 봅니다. ( my-pod 라고 가정 )
2. `kubectl logs -f my-pod`를 이용하면 실시간으로 pod의 로그를 볼 수 있습니다.

### pod를 재시작 하는 법
1. `kubectl rollout restart deployment/krampoline`을 이용하면 krampoline을 이름으로 가지는 deployment를 재시작합니다.


## 필요 사항

- [기본적인 IDE 사용법](https://krampoline-help.goorm.io/) (자세한 내용은 가이드 문서 참조)

## 주의 사항

- 꼭 `Dockerfile`과 `k8s` 폴더를 프로젝트에 포함시켜주세요.
  - 프로젝트의 루트 (`/`) 위치에 포함되게 해주세요.
- `k8s/deployment.yaml`과 `k8s/ingress.yaml` 파일은 필히 확인하시기 바랍니다.
- `main`브런치에 작성해주세요.
