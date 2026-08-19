namespace WebApplication1
{
    public interface IFileService
    {
        Task<string> SaveFileAsync(IFormFile file);
    }
}
