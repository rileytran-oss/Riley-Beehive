---
date: 2026-05-05
source:
tags:
  - AI
  - WikiLib
  - manuals
---
# Xây thư viện Wiki do AI vận hành — Kiến trúc Karpathy

> Hướng dẫn thực hành từ đầu đến cuối: từ ý tưởng đến một wiki library hoạt động được, dựa trên kiến trúc của Andrej Karpathy, adapted cho Obsidian + Claude.
> 
> **3 sản phẩm trong Claude Desktop app — và vai trò trong workflow này:**
> 
> - **Chat** — thiết kế hệ thống, lên kế hoạch, viết `wikiCLAUDE.md` _(conversation, không access files)_
> - **Cowork** — thực thi trực tiếp với vault: ingest clips, compile wiki pages, generate outputs _(agentic, access local files)_
> - **Code** — dành cho software development; không cần cho workflow wiki này

---

## Ý tưởng gốc

Karpathy đề xuất một cách tiếp cận khác với RAG (Retrieval-Augmented Generation) truyền thống. Thay vì để AI đọc lại toàn bộ tài liệu thô mỗi lần được hỏi, ta build một **wiki sống** — AI đọc nguồn một lần, compile ra knowledge có cấu trúc, rồi maintain wiki đó liên tục khi có thêm nguồn mới.

Analogy từ software engineering: raw sources là source code, LLM là compiler, wiki là executable output. RAG chạy lại compiler mỗi lần. Wiki chỉ chạy một lần — sau đó chỉ đọc output.

**Kết quả thực tế:** query nhanh hơn, context rõ hơn, cross-reference tự động, AI có thể phát hiện mâu thuẫn giữa các nguồn.

---

## Kiến trúc 3 layer

```
Clippings/          ← Layer 1: nguồn thô (Bạn curate dùng Plugin Obdidian Web Clipper)
      ↓
wiki/               ← Layer 2: AI compile (AI territory)
      ↓
outputs/            ← Layer 3: AI generate theo lệnh
```

**Layer 1 — Clippings:** nơi tích lũy tài liệu từ web, YouTube, personal notes. Đã curated — chỉ clip những gì chất lượng và liên quan. AI đọc nhưng không bao giờ ghi hay sửa.

**Layer 2 — Wiki:** AI compile từ Clippings ra các wiki pages có cấu trúc, cross-linked, cited. Đây là territory của AI.

**Layer 3 — Outputs:** blog posts, scene drafts, module outlines, worksheets — AI generate theo lệnh cụ thể, không tự động.

---

## Cấu trúc folder trong Obsidian

```
[Root Vault]/              ← root vault (tên vault của bạn)
│
├── WikiLib/                  ← toàn bộ hệ thống wiki nằm ở đây
│   ├── wikiCLAUDE.md         ← schema điều hành — quan trọng nhất
│   ├── CURRENT.md            ← working memory, cập nhật sau mỗi session
│   ├── _conflicts.md         ← AI flag mâu thuẫn vào đây
│   │
│   ├── wiki/                 ← AI territory
│   │   ├── <topic-1>/
│   │   │   ├── concepts/
│   │   │   ├── <subfolder>/
│   │   │   └── _index.md
│   │   ├── <topic-2>/
│   │   ├── _crosslinks/      ← concepts overlap giữa các topics
│   │   └── _index.md         ← catalog toàn bộ wiki
│   │
│   └── outputs/              ← AI-generated on demand
│       ├── <output-type-1>/
│       └── <output-type-2>/
│
├── Clippings/                ← nguồn thô, giữ ở root vault
│   ├── <topic-1>/
│   ├── <topic-2>/
│   └── ...
│
└── ... (phần còn lại của vault)
```

**Tại sao `Clippings/` ở root vault thay vì trong `WikiLib/`?** Vì Clippings là inbox chung — về sau có thể dùng cho nhiều mục đích khác ngoài wiki library. Giữ ở root linh hoạt hơn.

---

## File quan trọng nhất: wikiCLAUDE.md

Đây là "bộ não điều hành" của toàn bộ hệ thống. AI đọc file này trước khi làm bất cứ thao tác nào trong vault. Nó định nghĩa:

- Cấu trúc vault và vai trò từng folder
- Mô tả từng nhóm chủ đề và mục đích
- Templates cho từng loại wiki page
- 5 operations AI được phép làm (INGEST, QUERY, GENERATE OUTPUT, LINT, REORGANIZE)
- Quy tắc vận hành — thứ AI không được tự ý làm

**Nguyên tắc viết `wikiCLAUDE.md`:**

- Rõ ràng hơn là ngắn gọn — AI cần đủ context để không phải đoán
- Định nghĩa rõ boundary: AI làm gì, không làm gì
- Templates cụ thể cho từng loại page — càng cụ thể, output càng nhất quán
- Mở cửa cho scale: hướng dẫn cách thêm topic mới mà không phá vỡ structure

---

## Thiết kế topic và subfolder

Mỗi topic cần trả lời 3 câu hỏi trước khi tạo:

1. **Mục đích chính là gì?** — research cho fiction, deliverable trực tiếp, hay personal knowledge?
2. **Wiki dùng để làm gì cụ thể?** — viết scenes, tạo tools, outline modules?
3. **Output hướng đến đâu?** — blog, novel, course, hay internal only?

Câu trả lời quyết định subfolder structure. Ví dụ:

|Topic|Mục đích|Subfolder tiêu biểu|
|---|---|---|
|Culinary|Fiction research|concepts, figures, scenes|
|Psychotherapy|Fiction research|concepts, modalities, scenes|
|Life Coaching|Deliverable trực tiếp|concepts, tools, modules|

Topics khác nhau về bản chất có thể overlap — đó là lý do cần folder `_crosslinks/` để AI ghi lại những điểm giao nhau thay vì duplicate content.

---

## Page templates

Templates là thứ quyết định chất lượng wiki. Không có template rõ ràng, AI sẽ tự ý format — mỗi page một kiểu, không query được nhất quán.

**Template tối thiểu cho mọi page:**

```markdown
---
tags: [wiki, <topic>, <type>]
sources: []
last-updated: YYYY-MM-DD
---

# <Title>

## <Section chính>
Nội dung.

## Cross-links
- [[related page]]

## Sources
- [[Clippings/<topic>/filename]]
```

**Thêm fields tùy mục đích:**

- `blog-ready: yes/no` — cho life coaching tools
- `module-fit: yes/no` — cho tools có thể đưa vào course
- `fiction-use: yes/no` — cho concepts dùng trong novel

---

## 5 Operations AI thực hiện

### INGEST

Trigger: khi có files mới trong `Clippings/<topic>/`

AI làm: đọc file → extract concepts/scenes/tools → tạo/cập nhật wiki pages → update index → check cross-links → flag conflicts nếu có → update CURRENT.md

Lệnh mẫu:

> _"Đọc wikiCLAUDE.md rồi ingest tất cả files mới trong Clippings/culinary/"_

---

### QUERY

Trigger: khi cần hỏi wiki

AI làm: đọc `_index.md` → xác định page liên quan → drill vào file → trả lời với citation

Lệnh mẫu:

> _"Tìm tất cả concepts liên quan đến kitchen hierarchy trong wiki culinary"_

---

### GENERATE OUTPUT

Trigger: khi cần tạo deliverable từ wiki

AI làm: đọc wiki pages liên quan → tạo file trong `outputs/` theo format yêu cầu

Lệnh mẫu:

> _"Tạo blog post từ wiki/life-coaching/tools/X, tone conversational, 800 từ"_ _"Draft scene từ wiki/culinary/scenes/Y cho chapter 3"_

---

### LINT

Trigger: chạy định kỳ, không cần thường xuyên

AI kiểm tra: broken wikilinks, pages không có sources, concepts được nhắc đến nhưng chưa có page riêng, index chưa sync, conflicts chưa resolve

AI **báo cáo**, không tự sửa — người dùng quyết định.

Lệnh mẫu:

> _"Chạy lint cho toàn bộ WikiLib"_

---

### REORGANIZE

Trigger: chỉ khi được yêu cầu rõ ràng

AI đọc toàn bộ wiki của topic → restructure lại → giữ nguyên sources. Không tự ý làm khi không được lệnh.

---

## Quy tắc vận hành quan trọng

Ghi rõ trong `wikiCLAUDE.md` để AI không vượt ranh giới:

1. **Không ghi, không sửa, không xóa file trong `Clippings/`** — nguồn gốc bất biến
2. **Không tự generate outputs** — chỉ tạo khi có lệnh cụ thể
3. **Luôn cite nguồn** — mọi claim trong wiki phải trỏ về `[[Clippings/...]]`
4. **Flag, không quyết định** — khi phát hiện conflict giữa sources, ghi vào `_conflicts.md`, không tự chọn cái nào đúng
5. **Hỏi trước khi REORGANIZE** — không tự restructure toàn bộ topic

---

## Quy trình thực hành hàng ngày

### Clip content → Wiki

```
1. Clip bình thường vào Clippings/<topic>/
        (không cần làm gì thêm lúc này)

2. Khi đủ batch hoặc cần dùng wiki:
   Mở Cowork, trỏ vào root vault
   Lệnh: "Ingest files mới trong Clippings/<topic>/"

3. Kiểm tra wiki/<topic>/_index.md
   Đọc qua vài pages — feedback nếu cần

4. Định kỳ: chạy LINT
   "Chạy lint cho WikiLib"

5. Khi cần output:
   "Tạo [blog post / scene draft / module outline] từ wiki/..."
```

**Tần suất ingest:** không cần mỗi lần clip. Clip tự do, ingest theo batch — một tuần một lần hoặc khi cần dùng wiki cho việc viết là đủ.

---

## Setup lần đầu

**Bước 1 — Tạo folder structure**

Tạo folder `WikiLib/` trong root vault Obsidian. Tạo file `wikiCLAUDE.md`, `CURRENT.md`, `_conflicts.md` bên trong.

**Bước 2 — Viết wikiCLAUDE.md**

Đây là bước quan trọng nhất. Cần xác định rõ:

- Các topics và mục đích của từng topic
- Subfolder structure cho mỗi topic
- Templates cho từng loại page
- Operations và quy tắc vận hành

Dành 1-2 giờ cho bước này. Chất lượng của `wikiCLAUDE.md` quyết định chất lượng của toàn bộ wiki về sau.

**Bước 3 — Để Cowork tạo subfolders**

Mở Cowork, trỏ vào root vault, lệnh:

> _"Đọc WikiLib/wikiCLAUDE.md rồi tạo toàn bộ subfolder structure bên trong WikiLib/"_

**Bước 4 — Test ingest nhỏ**

Chọn một topic đã có sẵn clips. Ingest batch đầu tiên (~5 files). Đọc wiki pages được tạo ra — điều chỉnh templates trong `wikiCLAUDE.md` nếu output chưa đúng ý.

**Bước 5 — Scale**

Sau khi pipeline hoạt động đúng với một topic, áp dụng cho các topics còn lại.

---

## Mở rộng sang topic mới

Khi cần thêm topic (ví dụ: neuroscience, somatic practices, education...):

1. Tạo folder `Clippings/<topic>/` — bắt đầu clip
2. Tạo folder `wiki/<topic>/` với subfolders phù hợp
3. Thêm entry vào `wiki/_index.md`
4. Khai báo topic mới trong `wikiCLAUDE.md` — mục đích, subfolder, template nếu cần
5. Xem xét cross-links với các topics hiện có — có overlap không?

Không cần thay đổi gì trong cấu trúc tổng thể.

---

## Lưu ý

**Không phải fully automated.** AI draft và bạn approve — wiki chỉ tốt bằng review process của người dùng. Đây là "AI-assisted", không phải "AI-autonomous".

**Scale có ceiling.** Ở quy mô lớn (~100+ pages per topic), `_index.md` có thể dài đến mức AI chọn sai page khi query. Giải pháp: chia nhỏ index theo subfolder, hoặc thêm summary cụ thể hơn cho mỗi entry.

**Conflicts cần người giải quyết.** AI flag nhưng không quyết định — đặc biệt khi sources có ngày khác nhau hoặc quan điểm trái ngược. `_conflicts.md` cần được review định kỳ.

**Context window.** Khi ingest batch lớn (20+ files cùng lúc), AI có thể miss cross-links hoặc bỏ sót concepts. Ingest theo batch nhỏ hơn nếu cần độ chính xác cao.

---

## Tools cần thiết

|Tool|Vai trò|
|---|---|
|Obsidian|Vault management, đọc wiki|
|Obsidian Web Clipper|Clip content vào Clippings/|
|Claude Chat|Thiết kế hệ thống, lên kế hoạch, viết wikiCLAUDE.md|
|Cowork|AI engine thực thi — ingest, compile wiki, generate outputs|
|wikiCLAUDE.md|Schema điều hành — không thể thiếu|

**Phân biệt Chat vs Cowork trong workflow này:**

- Dùng **Claude Chat** khi: thiết kế hệ thống, quyết định structure, viết schema, lên kế hoạch
- Dùng **Cowork** khi: thực thi với files thật — ingest clips, tạo wiki pages, chạy lint, generate outputs

Không cần Python, không cần vector database, không cần Claude Code — với quy mô vừa (~50–100 pages per topic), Cowork là đủ.

---

_Tài liệu này được tạo dựa trên quá trình thực hành thực tế. Cập nhật khi workflow thay đổi._

# Related
- [[2026-05-05 Dùng Skill viết wikiCLAUDE - Schema vận hành cho WikiLib]]
- [[Hướng dẫn cài và sử dụng Obsidian Web Clipper]]