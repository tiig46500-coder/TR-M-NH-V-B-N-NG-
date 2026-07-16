import { QuizQuestion, LạngSơnPlace, FlashcardItem, Confession } from "./types";

export const ONBOARDING_LETTER = {
  title: "Gửi cậu, người bạn đang cảm thấy ngợp giữa thế giới ảo...",
  content: `Cậu có bao giờ tắt màn hình điện thoại và cảm nhận một khoảng trống rỗng vô hình ập đến?
  
Nhìn quanh Instagram hay TikTok, ai cũng có vẻ thành công, xinh đẹp, và ngập tràn niềm vui. Những thông báo lấp lánh liên tục đòi hỏi sự chú ý của cậu, tạo nên một nỗi sợ vô hình: sợ bị bỏ lại phía sau (FOMO), áp lực phải hoàn hảo, và áp lực đồng trang lứa đè nặng lên vai.

Trạm Định Vị Bản Ngã (Identity Compass) không phải là nơi phán xét hay khuyên nhủ. Đây là góc nhỏ bình yên nâng niu cảm xúc của cậu. Nơi cậu có thể đo lường sức khỏe tinh thần, trút bỏ những gánh nặng ẩn danh, bắt đầu hành trình thải độc số, và bước chân ra thế giới thực tại đầy nắng gió của Xứ Lạng.

Cảm ơn cậu vì đã ở đây. Cậu không hề cô đơn trên hành trình định vị chính mình. 🌱`,
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
    content: "Nhìn stories các bạn đi du lịch, đạt học bổng xuất sắc, tớ thấy mình như một kẻ vô dụng tụt hậu phía sau... Áp lực đồng trang lứa thực sự quá lớn.",
    timestamp: "10 phút trước",
    color: "bg-amber-50 text-slate-700 border-amber-200",
    rotation: "rotate-1",
  },
  {
    id: "conf-2",
    content: "Sợ nhất là cảm giác tắt điện thoại lúc 2h sáng sau hàng tiếng lướt Reels vô thức. Căn phòng tối om, lồng ngực trống rỗng và lo âu ngập tràn.",
    timestamp: "1 giờ trước",
    color: "bg-sky-50 text-slate-700 border-sky-200",
    rotation: "-rotate-2",
  },
  {
    id: "conf-3",
    content: "Tớ ước gì bố mẹ ngừng so sánh tớ với 'con nhà người ta'. Điểm số không nói lên tất cả, nhưng ở nhà tớ không bao giờ cảm thấy mình đủ tốt.",
    timestamp: "3 giờ trước",
    color: "bg-emerald-50 text-slate-700 border-emerald-200",
    rotation: "rotate-3",
  },
  {
    id: "conf-4",
    content: "Có ai giống mình không, mỗi lần đăng ảnh là ngồi canh tim từng phút một. Nếu ít tương tác là mình lại muốn xóa bài ngay lập tức...",
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
];
