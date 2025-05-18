namespace Karpova_back_diplom.Models
{
    public class User
    {
        public int id { get; set; }
        public string login { get; set; }
        public string password { get; set; }

        public string lastname { get; set; }
        public string firstname { get; set; }
        public string patronymic { get; set; }
        public bool admin_role { get; set; }
        public string fullName
        {
            get
            {
                return $"{lastname} {firstname} {patronymic}";
            }
        }
    }
}
