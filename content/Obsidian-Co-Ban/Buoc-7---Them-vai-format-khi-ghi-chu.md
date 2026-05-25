---
title: Bước 7 - Thêm vài format khi ghi chú
source: '[[Start Here - WHY Obsidian and HOW]]'
tags:
  - Obsidian
  - manual
---

Up: [[Obsidian Phần 1]]
--- ---
Với mình thì màu mè hơn chút giúp note của mình dễ nhìn hơn, nên là mình hay *làm màu*. `^__^`

##### Bảng biểu - Tables
Cách 1: dùng công thức
`Header 1 | Header 2 | Header 3`
`------ | ------ | ------`

First Header | Second Header
------------ | ------------
Content from cell 1 | Content from cell 2
Content in the first column | Content in the second column

###### Căn trái-phải-giữa trong bảng
Dùng dấu hai chấm `:` như sau `:------ | :------: | ------:`

First Header | Second Header | Third Header
:------------ | ------------: | :-------------:
left aligned | right aligned | centered

Cách 2: Tải plugin *Markdown Table Editor* (sau khi tải bất kỳ plugin nào, bạn nhớ bấm enable nhé.)

![[markdowntableeditor.png|300]]
Sau khi tải và enable, sẽ xuất hiện 1 biểu tượng bảng biểu trên thanh công cụ bên trái.

![[Obsidiansetting_mdtableeditor.png]]
Click vào sẽ xuất hiện một màn hình split down, nơi bạn có thể set up một bảng mẫu có bao nhiêu cột, hàng, trực tiếp edit trong bảng. Edit xong thì bấm Update table.

![[Obsidian_mdtable.png]]

##### Cước chú - Footnote
Dùng `[^1]` và chỗ footnote `[^1]:`
Ví dụ:
Tôi muốn đặt một cước chú ở đây. [^1]

[^1]: chỗ này là foot note đây, nhưng nhớ phải để một dòng trắng ở giữa. Và footnote chỉ hiển thị trong Reading mode. Bật qua Reading mode để thấy nó hiển thị như thế nào (trên web thì đã tự động ở dạng Reading mode)

##### Trích dẫn - Quote
`> `
> It looks like this.

Để tạo nhiều kiểu trích dẫn nổi bật khác, xem [[#Callouts]] 

##### Callouts

Dùng `> [!...]` với nhiều icon khác nhau:

`> [!note]`
>[!note] Note
>This a note.

`> [!tldr]`
> [!tldr] Summary/ Abstract
> This is a summary.

`> [!done]`
> [!done] Success/ Checked/ Done
> This is a tip.

`> [!question]`
> [!question] Question
> any question?

`> [!caution]`
> [!caution] Warning/ Caution/ Attention
> Head-up!

`> [!tip]`
> [!tip] Tip/ Important/ Hint
> This is important.

`> [!todo]`
> [!todo]
> - [ ] to do đi nào

`> [!quote]`
> [!quote] Quote/ Citation
> say something useful

- thêm một dấu trừ bên phải ngoặc vuông để mặc định ẩn nội dung block này.

`> [!question]-`
> [!question]- I have a question here.
> Is it collapsed by default?
> Yes, it is.

> [!quote]- Quote/ Citation
> say something useful

Xem thêm ở đây:
[Obsidian Callouts](https://www.youtube.com/watch?v=TqYQ0kA1yAo)
All types of Callouts [Callouts - Obsidian Help](https://help.obsidian.md/callouts)

