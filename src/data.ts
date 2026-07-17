import { QuizQuestion, LạngSơnPlace, FlashcardItem, Confession } from "./types";

export const ONBOARDING_LETTER = {
  title: 'THƯ NGỎ: GỬI CẬU - NGƯỜI ĐANG ĐI TÌM "LA BÀN" GIỮA KỶ NGUYÊN THUẬT TOÁN 🧭',
  content: `Chào cậu, người đang dừng chân tại Trạm định vị bản ngã, 👋

Cậu có đang cảm thấy kiệt sức sau hàng giờ lướt smartphone? 📱

Chúng mình hiểu, trưởng thành trong thời đại số chưa bao giờ là điều dễ dàng. Đằng sau những màn hình phát sáng là vô vàn áp lực không tên: Cảm giác chông chênh khi thấy bạn bè liên tục khoe thành tích (Peer pressure) 📈, nỗi sợ bị bỏ lỡ các trào lưu (FOMO) ⏳, và cả sự mệt mỏi khi phải liên tục đắp nặn một "nhân dạng ảo" hoàn hảo để đổi lấy những lượt thả tim vô thưởng vô phạt. 💔

Đôi khi, giữa những tiếng "ting ting" của thông báo, cậu bỗng giật mình tự hỏi: "Rốt cuộc, mình thực sự là ai ngoài đời thực?" 🤔

Cậu không cô đơn, và sự chông chênh ấy hoàn toàn có cơ sở khoa học. 🧪

Dưới góc nhìn của Tâm lý học phát triển, tuổi vị thành niên vốn đã là giai đoạn nhạy cảm của quá trình Định hình bản sắc (Identity Formation). Thế nhưng, sự can thiệp của các thuật toán mạng xã hội đã vô tình đẩy nhanh và khuếch đại những khủng hoảng tâm lý. Thay vì khám phá bản thân qua các trải nghiệm thực tế, chúng ta đang bị cuốn vào vòng lặp của sự "so sánh xã hội" (Social Comparison), khiến chiếc la bàn nội tâm bị nhiễu loạn. 🌪️

Đó chính là lý do La Bàn Bản Ngã (Identity Compass) ra đời. 🧭

Đây không phải là một trang web giáo điều, cũng không phải một phòng khám tâm lý khô khan. Đây là một Hệ sinh thái can thiệp số 4D – một không gian an toàn, hoàn toàn ẩn danh, được thiết kế riêng để giúp cậu:
✨ Đo lường mức độ "chông chênh" của bản thân qua các thang đo chuẩn khoa học.
🌿 Thải độc khỏi những áp lực ảo và sự so sánh độc hại.
🌱 Khám phá lại những giá trị thật và thế mạnh độc bản của chính mình.

Cam kết của chúng mình: Mọi thao tác, chia sẻ và kết quả bài test của cậu tại Trạm định vị này đều được mã hóa và bảo mật ẩn danh 100%. Dữ liệu chỉ phục vụ cho mục đích nghiên cứu khoa học, vì sự an toàn tâm lý của cậu là ưu tiên tối thượng. 🔒

Thế giới ảo có thể làm cậu lạc bước, nhưng la bàn nội tâm sẽ đưa cậu về nhà. Cậu đã sẵn sàng gác lại những bộ lọc (filter) trên mạng để bắt đầu hành trình tìm kiếm phiên bản nguyên bản nhất của chính mình chưa? 💚`,
};

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    text: "Tớ cảm thấy bồn chồn, lo lắng khi không thể kiểm tra mạng xã hội thường xuyên (sợ bỏ lỡ tin tức, xu hướng).",
  },
  {
    id: 2,
    text: "Tớ thường tự so sánh cuộc sống, ngoại hình, hoặc thành tích của mình với những gì người khác chia sẻ trên mạng.",
  },
  {
    id: 3,
    text: "Tớ thường xuyên thức khuya hoặc bỏ lỡ các công việc thực tế chỉ vì lướt màn hình vô thức (TikTok, Reels, Threads).",
  },
  {
    id: 4,
    text: "Tớ cảm thấy áp lực phải luôn tỏ ra vui vẻ, hoàn hảo hoặc thành công trước mắt bạn bè và mọi người xung quanh.",
  },
  {
    id: 5,
    text: "Sau khi sử dụng mạng xã hội trong thời gian dài, tớ thường cảm thấy trống rỗng, mệt mỏi hoặc nghi ngờ giá trị bản thân.",
  },
  {
    id: 6,
    text: "Tớ cảm thấy bất an hoặc buồn bã khi những bài đăng hoặc bức ảnh của mình nhận được ít lượt thích (like), bình luận hay tương tác.",
  },
  {
    id: 7,
    text: "Tớ có xu hướng liên tục làm mới (refresh) bảng tin một cách vô thức ngay cả khi không có thông báo gì mới.",
  },
  {
    id: 8,
    text: "Tớ cảm thấy khó tập trung vào học tập hoặc trò chuyện trực tiếp với người thân mà không liếc nhìn điện thoại.",
  },
  {
    id: 9,
    text: "Tớ dễ bị ảnh hưởng tâm trạng bởi các bình luận hoặc ý kiến trái chiều của người lạ trên không gian mạng.",
  },
  {
    id: 10,
    text: "Tớ cảm thấy kiệt sức trước lượng thông tin dồn dập trên internet nhưng lại không đủ dũng khí để tạm dừng hoặc tắt máy.",
  },
  {
    id: 11,
    text: "Tớ thường xuyên có cảm giác 'mọi người xung quanh đều đang tiến bộ và hạnh phúc hơn mình' mỗi khi lướt mạng.",
  },
  {
    id: 12,
    text: "Tớ cảm thấy thế giới ảo trên màn hình đôi khi chân thực và dễ chia sẻ cảm xúc hơn cuộc sống đời thực xung quanh mình.",
  },
];

export const INITIAL_CONFESSIONS: Confession[] = [
  {
    id: "conf-1",
    content: "Nhìn những mảng màu rực rỡ trên story của bạn bè – người đi du lịch, kẻ nhận học bổng... tớ bỗng thấy chênh vênh. Giữa thanh xuân rực rỡ của mọi người, tớ thấy mình như một nốt lặng mờ nhạt, cứ mãi loay hoay phía sau.",
    timestamp: "10 phút trước",
    color: "bg-amber-50 text-slate-700 border-amber-200",
    rotation: "rotate-1",
  },
  {
    id: "conf-2",
    content: "Sợ nhất là khoảnh khắc buông điện thoại xuống lúc 2h sáng. Ánh sáng màn hình vụt tắt, chỉ còn lại căn phòng tối om. Những video lướt vô thức không thể lấp đầy khoảng trống và sự lo âu đang ngập tràn trong lồng ngực.",
    timestamp: "1 giờ trước",
    color: "bg-sky-50 text-slate-700 border-sky-200",
    rotation: "-rotate-2",
  },
  {
    id: "conf-3",
    content: "Chỉ mong một lần bố mẹ nhìn nhận sự nỗ lực của tớ, thay vì cái bóng của 'con nhà người ta'. Những con số vô tri trên bài thi đâu thể gói ghém hết những giọt nước mắt tớ đã giấu kín vùi vào gối mỗi đêm.",
    timestamp: "3 giờ trước",
    color: "bg-emerald-50 text-slate-700 border-emerald-200",
    rotation: "rotate-3",
  },
  {
    id: "conf-4",
    content: "Học ở trường Chuyên áp lực thật sự. Xung quanh ai cũng giỏi giang, năng động và luôn tiến về phía trước. Đôi lúc, tớ thấy mình kiệt sức vì phải gồng gánh những kỳ vọng vô hình, chỉ muốn tìm một góc nhỏ để được khóc cho nhẹ lòng.",
    timestamp: "Hôm qua",
    color: "bg-amber-50 text-slate-700 border-amber-100",
    rotation: "-rotate-1",
  },
  {
    id: "conf-5",
    content: "Trường Chuyên Lạng Sơn áp lực thực sự. Ai cũng giỏi giang, năng động, mình thấy mình như chiếc bóng mờ nhạt chông chênh vô định.",
    timestamp: "Hôm qua",
    color: "bg-pink-50 text-slate-700 border-pink-100",
    rotation: "rotate-2",
  },
];

export const LẠNG_SƠN_PLACES: LạngSơnPlace[] = [
  {
    id: "place-1",
    name: "Cột Cờ Núi Phai Vệ",
    description: "Nằm kiêu hãnh ngay giữa lòng thành phố Lạng Sơn, núi Phai Vệ là biểu tượng sức sống và lòng tự hào Xứ Lạng.",
    locationDetails: "Phường Vĩnh Trại, Thành phố Lạng Sơn",
    activityName: "Chinh phục 80 bậc đá & Đón gió lộng",
    activityDesc: "Hãy cất điện thoại vào balo, leo từng bậc đá lên đỉnh núi Phai Vệ lúc chiều tà. Phóng tầm mắt ngắm trọn vẹn thành phố lên đèn lung linh, cảm nhận làn gió mát rượi vuốt ve gương mặt để thấy thế giới thực tại rộng lớn nhường nào.",
    imagePrompt: "minimalist line art illustration of a tall flag pole on top of a rocky mountain in Vietnam, phai ve mountain lang son, warm evening sunset, soft colors",
  },
  {
    id: "place-2",
    name: "Thung Lũng Bắc Sơn",
    description: "Một thung lũng thơ mộng được bao bọc bởi những dãy núi đá vôi trùng điệp, nổi tiếng với cánh đồng lúa chín vàng rực rỡ.",
    locationDetails: "Huyện Bắc Sơn, Lạng Sơn (Cách TP 80km)",
    activityName: "Săn mây đỉnh Nà Lay & Ngắm đồng lúa chín",
    activityDesc: "Dành một ngày cuối tuần cùng bạn bè leo núi Nà Lay, ngắm dòng sông uốn lượn qua những thảm lúa vàng ươm thơm mùi rơm rạ. Tiếp xúc với người dân bản địa thân thiện để tìm lại kết nối ấm áp thực sự giữa con người.",
    imagePrompt: "watercolor drawing of a peaceful valley with yellow rice fields and towering mountains under fluffy white clouds, soft warm green and yellow palette",
  },
  {
    id: "place-3",
    name: "Quần Thể Động Chùa Tam Thanh",
    description: "Di tích lịch sử danh lam thắng cảnh nổi tiếng với vẻ đẹp kỳ vĩ của hang động tự nhiên hòa quyện nét linh thiêng.",
    locationDetails: "Phường Tam Thanh, Thành phố Lạng Sơn",
    activityName: "Đi bộ tĩnh tâm & Nghe tiếng nước chảy",
    activityDesc: "Bước vào hang đá mát lạnh, ngắm nhìn tượng Phật ẩn hiện dưới ánh sáng len lỏi từ giếng trời tự nhiên. Nghe tiếng giọt nước thánh thót rơi từ thạch nhũ để thanh lọc tâm trí khỏi những xô bồ của thế giới mạng.",
    imagePrompt: "cozy elegant sketch of a serene cave temple with warm candlelight, historic temple in mountain cave, light rays shining from ceiling",
  },
  {
    id: "place-4",
    name: "Đỉnh Núi Mẫu Sơn",
    description: "Vùng núi cao quanh năm sương mờ bao phủ, nổi tiếng với khí hậu mát mẻ, biệt thự cổ kiểu Pháp và hoa đào rực rỡ.",
    locationDetails: "Huyện Cao Lộc & Lộc Bình, Lạng Sơn",
    activityName: "Thử thách 24h ngắt kết nối (No-signal Detox)",
    activityDesc: "Mẫu Sơn là nơi tuyệt vời nhất để ngắt kết nối. Sóng điện thoại chập chờn là cơ hội để cậu đốt lửa trại, uống trà san tuyết cổ thụ, đi dạo giữa rừng thông xanh rì và lắng nghe nhịp thở của núi rừng hoang sơ.",
    imagePrompt: "minimalist travel print style of misty mountains with pine trees, French villa ruins, cozy fog, green and grey color scheme",
  },
];

export const FLASHCARDS: FlashcardItem[] = [
  {
    id: 1,
    category: "FOMO",
    front: "Làm thế nào để vượt qua cảm giác bồn chồn khi thấy bạn bè đi chơi mà không có mình?",
    back: "Hãy thực hành 'JOMO' (Joy of Missing Out) - Niềm vui khi bỏ lỡ. Dành thời gian đó cho một hoạt động cậu yêu thích: đọc 5 trang sách, đắp mặt nạ, hoặc ngủ một giấc thật ngon. Stories là thước phim cắt ghép tốt đẹp nhất, không phải toàn bộ thực tại.",
  },
  {
    id: 2,
    category: "Social Detox",
    front: "Bí kíp 1 phút để ngắt cơn nghiện lướt màn hình vô thức (TikTok, Reels, Threads)?",
    back: "Sử dụng quy tắc 'Đặt rào cản vật lý': Di chuyển các ứng dụng gây nghiện vào một thư mục sâu ở trang cuối cùng, đổi giao diện điện thoại sang tông màu xám (Grayscale). Khi màn hình mất đi màu sắc kích thích, não bộ sẽ tự động giảm tiết dopamine lôi kéo cậu.",
  },
  {
    id: 3,
    category: "Peer Pressure",
    front: "Cậu thấy mình kém cỏi khi người khác liên tục chia sẻ bảng điểm toàn A hoặc học bổng?",
    back: "Mỗi đóa hoa có một mùa nở rộ riêng. Sự so sánh duy nhất có giá trị là so sánh với chính cậu của ngày hôm qua. Hãy viết ra 3 điều cậu đã làm tốt hôm nay, dù chỉ là uống đủ nước hay dậy đúng giờ. Cậu đang đi đúng lộ trình của riêng mình.",
  },
  {
    id: 4,
    category: "Mindfulness",
    front: "Khi cơn lo âu hoặc ngột thở vì áp lực ập đến bất ngờ, tớ phải làm gì ngay lập tức?",
    back: "Thực hành quy tắc hít thở hộp (Box Breathing): Hít vào 4 giây - Nín thở 4 giây - Thở ra 4 giây - Nín thở 4 giây. Lặp lại 4 chu kỳ. Phương pháp này gửi tín hiệu an toàn đến hệ thần kinh, giúp nhịp tim ổn định và xoa dịu não bộ tức thì.",
  },
  {
    id: 5,
    category: "Trì hoãn",
    front: "Làm thế nào để bắt tay vào học bài ngay lập tức khi đang nằm dài thèm lướt mạng xã hội?",
    back: "Áp dụng 'Quy tắc 5 giây': Đếm ngược 5 - 4 - 3 - 2 - 1 và đứng bật dậy ngồi vào bàn ngay. Cam kết chỉ học đúng 2 phút rồi được nghỉ. Thường thì rào cản lớn nhất nằm ở việc bắt đầu, khi đã ngồi vào bàn bạn sẽ dễ dàng làm tiếp! 🌱",
  },
  {
    id: 6,
    category: "Áp lực thi cử",
    front: "Tớ luôn bị căng thẳng tột độ, tim đập thon thót và bỗng quên hết kiến thức ngay trước giờ thi?",
    back: "Nhắm mắt, hít vào sâu bằng mũi cho bụng phình lên, thở ra chậm rãi bằng miệng cho bụng xẹp xuống. Nghĩ thầm: 'Mình đã nỗ lực hết mình, bài thi này không định nghĩa toàn bộ giá trị của mình.' Hơi thở sâu sẽ dẹp tan hoocmon stress, bật lại sự minh mẫn. ✨",
  },
  {
    id: 7,
    category: "Mất tập trung",
    front: "Làm sao để tập trung cao độ khi tự học tại nhà mà không bị xao nhãng bởi điện thoại hay tin nhắn?",
    back: "Sử dụng phương pháp Pomodoro: Hẹn giờ 25 phút học hoàn toàn nghiêm túc (úp điện thoại xuống hoặc để xa tầm tay), sau đó tự thưởng 5 phút nghỉ ngơi. Sau 4 chu kỳ thì nghỉ dài 15-20 phút. Chia nhỏ thời gian giúp não luôn tập trung cao độ. 🫧",
  },
  {
    id: 8,
    category: "Overthinking",
    front: "Mỗi đêm xuống tớ cứ trằn trọc suy nghĩ tiêu cực về những lỗi lầm cũ hoặc sợ hãi tương lai?",
    back: "Hãy thực hành 'Brain Dump' (Viết xả stress): Lấy một tờ giấy nháp, viết tự do tất cả những gì đang lộn xộn trong đầu ra mà không cần trau chuốt. Xong xuôi, hãy vo tròn tờ giấy lại và ném vào sọt rác. Hành động vật lý này giải phóng gánh nặng tâm lý cực tốt! 🌿",
  },
];
